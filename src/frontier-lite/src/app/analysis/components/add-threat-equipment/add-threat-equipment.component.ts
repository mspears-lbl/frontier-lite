import { Component, effect, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { EquipmentCollection, EquipmentCollectionData } from '../../../models/equipment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from '../../../services/message.service';
import { EquipmentMapComponent } from '../../../equipment/components/equipment-map/equipment-map.component';
import { EquipmentCollectionStore } from '../../../equipment/stores/equipment-collection.store';
import { ActiveEquipmentCollectionStore } from '../../../equipment/stores/active-equipment-collection.store';
import { AddEquipmentTableComponent } from '../add-equipment-table/add-equipment-table.component';

@Component({
    selector: 'app-add-threat-equipment',
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        AddEquipmentTableComponent,
        EquipmentMapComponent,
    ],
    templateUrl: './add-threat-equipment.component.html',
    styleUrl: './add-threat-equipment.component.scss'
})
export class AddThreatEquipmentComponent {
    readonly store = inject(EquipmentCollectionStore);
    readonly activeStore = inject(ActiveEquipmentCollectionStore)

    public viewEquipment = new EventEmitter<string | null>();
    public equipmentCollections: EquipmentCollection[] | null | undefined;
    private activeCollection: EquipmentCollectionData | null | undefined;
    public form: FormGroup | undefined;
    private selectedEquipment: string | null | undefined;

    get hasEquipment(): boolean {
        return this.activeCollection && this.activeCollection.data.length > 0
            ? true : false
    }
    get hasSelectedEquipment(): boolean {
        return this.selectedEquipment ? true : false;
    }

    constructor(
        private dbService: DatabaseService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        effect(() => {
            console.log('store data changed');
            console.log(this.store.data());
            this.equipmentCollections = this.store.data();
            console.log('active');
            console.log(this.activeStore.data());
            this.activeCollection = this.activeStore.data();
            this.setFormData();
        });
    }

    ngOnInit() {
        this.buildForm();
        this.setFormData();
    }

    private buildForm(): void {
        this.form = this.fb.group({
            activeCollection: [
                null,
                [
                    Validators.required,
                ]
            ],
        });
        this.form.controls['activeCollection'].valueChanges
            .subscribe((value: any) => {
                console.log('activeCollection form Change', value);
                const item = this.equipmentCollections?.find(item => item.id === value);
                if (item) {
                    this.activeStore.setData(item);
                }
                else {
                    this.messageService.display('An error occurred setting the equipment collection');
                }
            });
    }

    private setFormData(): void {
        this.form?.controls['activeCollection'].patchValue(this.activeCollection?.id ?? null, { emitEvent: false });
    }

    // private async loadCollections(): Promise<void> {
    //     console.log('get collections...');
    //     const results = await this.dbService.getEquipmentCollections();
    //     console.log(results);
    //     this.equipmentCollections = results.data || [];
    // }

    public viewEquipmentHandler(id: string): void {
        console.log('view equipment with id');
        console.log(id);
        this.viewEquipment.emit(id);
    }

    public zoomToAll(): void {
        console.log('zoom to all');
        this.viewEquipment.emit(null);
    }

    public equipmentSelected(id: string | null | undefined): void {
        console.log(`equipment selected ${id}`);
        this.selectedEquipment = id;
    }

    // public changeCollection(collection: EquipmentCollection): void {
    //     console.log('change collection');
    //     console.log(collection);
    //     // this.viewEquipment.emit(collection.id);
    // }

    public selectStrategies(): void {
        this.router.navigate(
            ['..', 'threat-strategy', this.selectedEquipment],
            {relativeTo: this.route}
        );
    }
}
