import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const numberRegex = /^-?[0-9]+(,[0-9]+)*(.[0-9]+)?$/;
export function numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const validNumber = numberRegex.test(control.value);
        return validNumber ? null : { validNumber: { value: control.value } };
    };
}
