import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class MessageService {

    constructor(
        private snackbar: MatSnackBar
    ) {
    }

    public display(message: string, options?: {duration: number}): void {
        this.snackbar.open(message, 'OK', {verticalPosition: 'top', ...options});
    }

}
