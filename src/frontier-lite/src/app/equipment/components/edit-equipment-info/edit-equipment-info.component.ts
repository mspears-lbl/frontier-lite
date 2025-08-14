import { Component, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EquipmentType, equipmentTypesList } from '../../../models/equipment-type';
import { CreateEquipmentMapComponent } from '../create-equipment-map/create-equipment-map.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { Equipment, isAddEquipmentParams, isValidEquipment } from '../../../models/equipment';
import { ActiveEquipmentCollectionStore } from '../../stores/active-equipment-collection.store';
import { Feature } from 'geojson';
import { deepCopy } from '../../../models/deep-copy';

@Component({
    selector: 'app-edit-equipment-info',
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        CreateEquipmentMapComponent

    ],
  templateUrl: './edit-equipment-info.component.html',
  styleUrl: './edit-equipment-info.component.scss'
})
export class EditEquipmentInfoComponent {
    readonly store = inject(ActiveEquipmentCollectionStore);
    public form: FormGroup | undefined;
    public formProps: FormGroup | undefined;
    public equipmentTypeList = equipmentTypesList;
    public equipmentType = signal<EquipmentType>(EquipmentType.GenerationAsset);
    private id: string | null | undefined;
    private equipment: Equipment | null | undefined;
    public clear$ = new EventEmitter<void>();
    get hasEquipmentType(): boolean {
        return this.equipmentType() ? true : false;
    }
    private _location: Feature | null | undefined;
    public location$ = signal<Feature | null | undefined>(undefined);
    get location(): Feature | null | undefined {
        return this._location;
    }
    get hasLocation(): boolean {
        return this._location ? true : false;
    }
    get hasEquipmentInfo(): boolean {
        return this.formProps?.valid ? true : false;
    }
    get canSave(): boolean {
        return this.hasLocation && this.hasEquipmentInfo
            ? true : false;
    }
    get isGeoLine(): boolean {
        return this.equipmentType() === EquipmentType.TransmissionLine
            ? true : false;
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.location$.set(undefined);
        this.buildForm();
        this.buildFormProps();
        this.setIdFromRoute();
    }

    private setIdFromRoute(): void {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log('id:', this.id);
            this.setEquipmentData();
        });
    }

    private setEquipmentData(): void {
        const collection = this.store.data();
        if (this.id && collection) {
            const feature = collection.data.find(item => item.id === this.route.snapshot.params['id']);
            this.equipment = feature ? deepCopy(feature) : undefined;
            console.log('equipment', this.equipment);
            if (this.equipment) {
                this._location = this.equipment.geo;
                this.location$.set(this.equipment.geo);
                this.formProps?.controls['name'].setValue(this.equipment.name, {emitEvent: false});
                this.form?.controls['equipmentType'].setValue(this.equipment.equipmentType, {emitEvent: false});
                this.equipmentType.set(this.equipment.equipmentType);
                console.log('set equipment', this._location);
            }
        }
        if (!this.equipment) {
            this.messageService.display('Unable to load the equipment data!');
            this._location = undefined;
            this.location$.set(undefined);
            this.formProps?.controls['name'].setValue('');
        }
    }

    private buildForm(): void {
        this.form = this.fb.group({
            equipmentType: [
                EquipmentType.GenerationAsset,
                [
                    Validators.required,
                ]
            ],
        });
        this.form.controls['equipmentType'].valueChanges
        .subscribe((value: EquipmentType) => {
            console.log('equipmentType', value);
            const currentValue = this.equipmentType();
            if (
                (
                    currentValue === EquipmentType.TransmissionLine
                    && value !== EquipmentType.TransmissionLine
                )
                ||
                (
                    currentValue !== EquipmentType.TransmissionLine
                    && value === EquipmentType.TransmissionLine
                )
            ) {
                this.clearLocation();
            }
            this.equipmentType.set(value);
        });
    }

    private buildFormProps(): void {
        this.formProps = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(50),
                ]
            ],
        });
    }

    public clearLocation(): void {
        this._location = undefined;
        this.clear$.emit();
    }

    /** Handles the events for when locations are added to the equipment map. */
    public equipmentLocationHandler(feature: Feature): void {
        console.log('equipmentLocationHandler', feature);
        this._location = feature;
    }

    public async save(): Promise<void> {
        console.log('save the equipment...');
        if (this._location && this.formProps?.valid && this.form?.valid && this.equipment) {
            const params = {
                id: this.equipment.id,
                equipmentType: this.form.controls['equipmentType'].value,
                name: this.formProps.controls['name'].value,
                geo: this._location,
                created: this.equipment.created
            }
            console.log('update the equipment:', params);
            if (!isValidEquipment(params)) {
                this.messageService.display("Unable to add the equipment to the database!");
                return;
            }
            console.log('update the equipment:', params);
            const result = await this.store.updateEquipment(params);
            if (result.success) {
                this.messageService.display('Equipment updated successfully', {duration: 5000});
                this.router.navigate(['/equipment']);
            }
            else {
                this.messageService.display(`Unable to add the equipment to the database!`);
            }
        }
    }
}
