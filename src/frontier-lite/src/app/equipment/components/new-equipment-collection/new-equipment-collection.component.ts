import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { trimmedMinLength } from '../../../utils/trimmed-string-validator';
import { DatabaseService } from '../../../services/database.service';
import { EquipmentCollection } from '../../../models/equipment';
import { MessageService } from '../../../services/message.service';

@Component({
    selector: 'app-new-equipment-collection',
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './new-equipment-collection.component.html',
    styleUrl: './new-equipment-collection.component.scss'
})
export class NewEquipmentCollectionComponent {
    public form: FormGroup| undefined;

    constructor(
        public dialogRef: MatDialogRef<NewEquipmentCollectionComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogParams
        private fb: FormBuilder,
        private dbService: DatabaseService,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.buildForm();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public ok(): void {
        this.dialogRef.close(true);
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    private buildForm(): void {
        this.form = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    trimmedMinLength(1),
                    Validators.maxLength(100)
                ]
            ],
        });

    }

    public async create(): Promise<void> {
        try {
            console.log('create the equipment collection...');
            const name = this.form?.controls['name'].value;
            if (this.form?.valid && typeof name === 'string') {
                const exists = await this.nameExists(name);
                console.log('name exists = ', exists);
                if (!exists) {
                    const newCollection = await this.createRecord(name);
                    this.dialogRef.close(newCollection);
                }
                else {
                    this.messageService.display(`The Equipment Group ${name} already exists!`);
                }
            }
        } catch (error: any) {
            this.messageService.display(`Unable to create the Equipment Group!`);
        }
    }

    private async nameExists(name: string): Promise<boolean> {
        return await this.dbService.equipmentGroupNameExists(name)
    }

    private async createRecord(name: string): Promise<EquipmentCollection> {
        const result = await this.dbService.insertEquipmentCollection(name);
        if (!result.data) {
            console.log(`error creating collection:`);
            console.log(result.error);
            throw new Error('Error creating collection!');
        }
        return result.data;
    }
}
