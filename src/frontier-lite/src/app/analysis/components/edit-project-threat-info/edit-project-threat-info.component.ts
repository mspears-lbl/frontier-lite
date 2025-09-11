import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
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
import { AddAnalysisProjectParams, AddProjectThreatRequest, isAddAnalysisProjectParams, isAddProjectThreatRequest, isProjectThreatUpdateParams, ProjectThreat } from '../../models/analysis-project';
import { MatSelectModule } from '@angular/material/select';
import { deepCopy } from '../../../models/deep-copy';
import { getThreatIcon, ThreatType, threatTypeList } from '../../../models/threats';
import { ActiveProjectStore } from '../../stores/active-project.store';

export interface DialogParams {
    projectThreat: ProjectThreat;
}

@Component({
    selector: 'app-edit-project-threat-info',
    imports: [
        CommonModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './edit-project-threat-info.component.html',
    styleUrl: './edit-project-threat-info.component.scss'
})
export class EditProjectThreatInfoComponent {
    public form: FormGroup| undefined;
    public threatTypes = deepCopy(threatTypeList);
    private store = inject(ActiveProjectStore);

    constructor(
        public dialogRef: MatDialogRef<EditProjectThreatInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogParams,
        private fb: FormBuilder,
        private dbService: DatabaseService,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        console.log('data', this.data);
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
                this.data.projectThreat.name,
                [
                    Validators.required,
                    trimmedMinLength(1),
                    Validators.maxLength(100)
                ]
            ],
            description: [
                this.data.projectThreat.description,
                [ Validators.maxLength(500) ]
            ],
            threatType: [
                this.data.projectThreat.threatType,
                [ Validators.required ]
            ]
        });
    }

    public async create(): Promise<void> {
        try {
            console.log('create the project threat...');

            if (this.form?.valid) {
                const id = this.data.projectThreat.id;
                const name = this.form?.controls['name'].value;
                const description = this.form?.controls['description'].value;
                const threatType = this.form?.controls['threatType'].value;
                const params = {
                    id,
                    threatType,
                    name,
                    description
                }
                console.log('params', params);
                if (!isProjectThreatUpdateParams(params)) {
                    this.messageService.display('Unable to edit the threat information!');
                    return;
                }
                const result = await this.store.updateThreat(params);
                if (result) {
                    this.messageService.display('The threat information was successfully updated!', {duration: 5000});
                    this.dialogRef.close(true);
                }
                else {
                    this.messageService.display('Unable to update the threat information!');
                }
            }
        } catch (error: any) {
            this.messageService.display(`Unable to update the threat information!`);
        }
    }

    public getIcon(threat: ThreatType): string {
        return getThreatIcon(threat);
    }
}
