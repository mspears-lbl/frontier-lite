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
import { AddAnalysisProjectParams, isAddAnalysisProjectParams } from '../../models/analysis-project';

@Component({
    selector: 'app-new-analysis-project',
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
    templateUrl: './new-analysis-project.component.html',
    styleUrl: './new-analysis-project.component.scss'
})
export class NewAnalysisProjectComponent {
    public form: FormGroup| undefined;

    constructor(
        public dialogRef: MatDialogRef<NewAnalysisProjectComponent>,
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
            description: [
                '',
                [ Validators.maxLength(500) ]
            ],
        });

    }

    public async create(): Promise<void> {
        try {
            console.log('create the analysis project...');

            if (this.form?.valid) {
                const name = this.form?.controls['name'].value;
                const description = this.form?.controls['description'].value;
                const params = {
                    name,
                    description
                }
                if (!isAddAnalysisProjectParams(params)) {
                    this.messageService.display('Unable to create the Analysis Project!');
                    return;
                }
                const result = await this.createRecord(params);
                if (result) {
                    this.dialogRef.close(true);
                }
            }
        } catch (error: any) {
            this.messageService.display(`Unable to create the Analysis Project!`);
        }
    }

    // private async nameExists(name: string): Promise<boolean> {
    //     return await this.dbService.equipmentGroupNameExists(name)
    // }

    private async createRecord(params: AddAnalysisProjectParams): Promise<boolean> {
        const result = await this.dbService.addProject(params);
        if (!result.success) {
            this.messageService.display('An error occurred creating the Analysis Project!');
            return false;
        }
        else {
            return true;
        }
    }
}
