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
import { AddAnalysisProjectParams, AddProjectThreatRequest, isAddAnalysisProjectParams, isAddProjectThreatRequest } from '../../models/analysis-project';
import { MatSelectModule } from '@angular/material/select';
import { deepCopy } from '../../../models/deep-copy';
import { getThreatIcon, ThreatType, threatTypeList } from '../../../models/threats';

export interface DialogParams {
    projectId: string;
}

@Component({
    selector: 'app-new-project-threat',
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
  templateUrl: './new-project-threat.component.html',
  styleUrl: './new-project-threat.component.scss'
})
export class NewProjectThreatComponent {
    public form: FormGroup| undefined;
    public threatTypes = deepCopy(threatTypeList);

    constructor(
        public dialogRef: MatDialogRef<NewProjectThreatComponent>,
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
            threatType: [
                ThreatType.WaterInundation,
                [ Validators.required ]
            ]
        });

    }

    public async create(): Promise<void> {
        try {
            console.log('create the project threat...');

            if (this.form?.valid) {
                const name = this.form?.controls['name'].value;
                const description = this.form?.controls['description'].value;
                const threatType = this.form?.controls['threatType'].value;
                const params = {
                    projectId: this.data.projectId,
                    threatType,
                    name,
                    description
                }
                console.log('params', params);
                if (!isAddProjectThreatRequest(params)) {
                    this.messageService.display('Unable to create the project threat!');
                    return;
                }
                const result = await this.createRecord(params);
                if (result) {
                    this.messageService.display('The threat was successfully created!', {duration: 5000});
                    this.dialogRef.close(true);
                }
                else {
                    this.messageService.display('Unable to create the project threat!');
                }
            }
        } catch (error: any) {
            this.messageService.display(`Unable to create the project threat!`);
        }
    }

    // private async nameExists(name: string): Promise<boolean> {
    //     return await this.dbService.equipmentGroupNameExists(name)
    // }

    private async createRecord(params: AddProjectThreatRequest): Promise<boolean> {
        const result = await this.dbService.addProjectThreat(params);
        if (!result.success) {
            this.messageService.display('An error occurred creating the project threat!');
            return false;
        }
        else {
            return true;
        }
    }

    public getIcon(threat: ThreatType): string {
        return getThreatIcon(threat);
    }
}
