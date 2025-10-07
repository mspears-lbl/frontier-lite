import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { trimmedMinLength } from '../../../utils/trimmed-string-validator';
import { DatabaseService } from '../../../services/database.service';
import { MessageService } from '../../../services/message.service';
import { AnalysisProject, UpdateAnalysisProjectParams } from '../../models/analysis-project';

export interface DialogParams {
    project: AnalysisProject;
}

@Component({
    selector: 'app-edit-project-info',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './edit-project-info.component.html',
    styleUrl: './edit-project-info.component.scss'
})
export class EditProjectInfoComponent {
    public form: FormGroup | undefined;

    constructor(
        public dialogRef: MatDialogRef<EditProjectInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogParams,
        private fb: FormBuilder,
        private dbService: DatabaseService,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.buildForm();
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    private buildForm(): void {
        this.form = this.fb.group({
            name: [
                this.data.project.name,
                [
                    Validators.required,
                    trimmedMinLength(1),
                    Validators.maxLength(100)
                ]
            ],
            description: [
                this.data.project.description,
                [Validators.maxLength(500)]
            ]
        });
    }

    public async save(): Promise<void> {
        try {
            if (this.form?.valid) {
                const params: UpdateAnalysisProjectParams = {
                    id: this.data.project.id,
                    name: this.form.controls['name'].value,
                    description: this.form.controls['description'].value
                };
                
                const result = await this.dbService.updateProject(params);
                if (result.success) {
                    this.messageService.display('Project updated successfully!', { duration: 5000 });
                    this.dialogRef.close(true);
                } else {
                    this.messageService.display('Unable to update project!');
                }
            }
        } catch (error: any) {
            this.messageService.display('Unable to update project!');
        }
    }
}