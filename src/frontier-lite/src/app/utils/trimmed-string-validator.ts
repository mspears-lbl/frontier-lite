import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function trimmedMinLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const trimmedLength = control.value.trim().length;
        return trimmedLength < minLength ? {
            trimmedMinLength: {
                requiredLength: minLength,
                actualLength: trimmedLength
            }
        } : null;
    };
}
