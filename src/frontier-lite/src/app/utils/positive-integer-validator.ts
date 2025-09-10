import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { formValueToNumber } from './form-value-to-number';

/**
 * A form Validator that allows integers with/without commas and no decimals.
 */
export function integerWithCommasValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Return null if empty (unless you want empty to be invalid)
        }

        // Regex for positive integers with optional commas
        const validFormat = /^[1-9]\d*(,\d+)*$|^0$/;

        const isValid = validFormat.test(control.value);

        return isValid ? null : { 'invalidInteger': true };
    };
}

/**
 * A form Validator that allows number ranges with/without commas.
 */
export function numberRangeWithCommasValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Return null if empty (unless you want empty to be invalid)
        }

        // check the string format
        const validFormat = /^[1-9]\d*((,\d{3})*)?(\.\d+)?$|^0$|^0\.\d+$/;
        const isFormatValid = validFormat.test(control.value);
        // check if the value falls within the correct range
        const numberValue = formValueToNumber(control.value);
        const isValueValid = typeof numberValue === 'number' &&
            numberValue >= min &&
            numberValue <= max;
        console.log(`origvalue = ${control.value}, numberValue = ${numberValue}, isValueValid = ${isValueValid}, formatValid = ${isFormatValid}`);
        return isFormatValid && isValueValid ? null : { 'invalidNumberRange': true };
    };
}
