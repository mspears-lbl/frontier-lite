import { Component, EventEmitter, Output } from '@angular/core';
import { LocationFinderService } from '../services/location-finder.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FindLocationsResponse, LocationResult } from '../../../../../common/models/find-locations';
import { debounceTime } from 'rxjs';

function isValidString(value: any): boolean {
    return (
        value &&
        typeof value === 'string' &&
        value.trim().length > 0
    ) ? true : false;
}

@Component({
  selector: 'app-location-finder',
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatAutocompleteModule
    ],
  templateUrl: './location-finder.component.html',
  styleUrl: './location-finder.component.scss'
})
export class LocationFinderComponent {
    public form: FormGroup | undefined;

    public options: LocationResult[] = [];

    @Output()
    public locationSelected = new EventEmitter<LocationResult>();

    get canSearch(): boolean {
        return (
            this.form?.valid &&
            isValidString(this.form.controls['search'].value)
        ) ? true : false;
    }

    constructor(
        private fb: FormBuilder,
        private locationService: LocationFinderService
    ) {
    }

    ngOnInit() {
        this.options = [];
        this.buildForm();
    }

    private buildForm(): void {
        this.form = this.fb.group({
            search: ['', [Validators.maxLength(100)]],
        });
        // watch for value changes
        this.form.controls['search'].valueChanges
        .pipe(debounceTime(400))
        .subscribe((value: string) => {
            console.log(`search for "${value}"`);
            this.findLocations();
        });
    }

    public findLocations(): void {
        const value = this.form?.controls['search'].value;
        if (isValidString(value) && this.form?.valid) {
            this.locationService.get({query: value})
            .subscribe({
                next: (response: FindLocationsResponse) => {
                    console.log(response);
                    this.options = response.results;
                },
                error: (error: any) => {
                    console.log(error);
                }
            })
        }
    }

    public selectOption(option: LocationResult): void {
        console.log(option);
        this.locationSelected.emit(option);
    }
}
