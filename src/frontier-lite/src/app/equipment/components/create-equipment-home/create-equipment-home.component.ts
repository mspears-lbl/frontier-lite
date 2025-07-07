import { Component, EventEmitter, inject, signal, effect } from '@angular/core';
import { EquipmentTableComponent } from '../equipment-table/equipment-table.component';
import { EquipmentMapComponent } from '../equipment-map/equipment-map.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EquipmentType, equipmentTypesList } from '../../../models/equipment-type';
import { CreateEquipmentMapComponent } from '../create-equipment-map/create-equipment-map.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Feature } from '../../../models/geojson.interface';
import { Router, RouterModule } from '@angular/router';
import { deepCopy } from '../../../models/deep-copy';
import { ActiveCollectionStore } from '../../../stores/active-collection.store';
import { MessageService } from '../../../services/message.service';
import { EquipmentCollectionStore } from '../../stores/equipment-collection.store';
import { AddEquipmentParams, isAddEquipmentParams } from '../../../models/equipment';
import { ActiveEquipmentCollectionStore } from '../../stores/active-equipment-collection.store';

@Component({
    selector: 'app-create-equipment-home',
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
    templateUrl: './create-equipment-home.component.html',
    styleUrl: './create-equipment-home.component.scss'
})
export class CreateEquipmentHomeComponent {
    readonly store = inject(ActiveEquipmentCollectionStore);
    public form: FormGroup | undefined;
    public formProps: FormGroup | undefined;
    public equipmentTypeList = equipmentTypesList;
    public equipmentType = signal<EquipmentType>(EquipmentType.GenerationAsset);
    public clear$ = new EventEmitter<void>();
    private _location: Feature | null | undefined;
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

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.buildFormProps();
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

    public save(): void {
        console.log('save the equipment...');
        const activeCollection = this.store.data();
        if (this._location && this.formProps?.valid && this.form?.valid && activeCollection) {
            const params = {
                collectionId: activeCollection.id,
                equipmentType: this.form.controls['equipmentType'].value,
                name: this.formProps.controls['name'].value,
                geo: this._location
            }
            console.log('add the equipment:', params);
            if (!isAddEquipmentParams(params)) {
                this.messageService.display("Unable to add the equipment to the database!");
                return;
            }
            this.store.addEquipment(params);
            // const equipment = deepCopy(this._location);
            // equipment.properties.name = this.formProps.controls['name'].value;
            // equipment.properties.equipmentType = this.form.controls['equipmentType'].value;
            // console.log('add the equipment');
            // console.log(equipment);
            // this.store.addEquipment(equipment);
            // this.router.navigate(['/equipment']);
            // this.messageService.display('Equipment added successfully', {duration: 5000});
        }
    }
}
