import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { NewEquipmentCollectionComponent } from './new-equipment-collection.component';

@Injectable({
    providedIn: 'root',
})
export class NewEquipmentCollectionService {

    constructor(
        private dialog: MatDialog
    ) {
    }

    public confirm(message: string): Observable<boolean> {
        return this.dialog.open(NewEquipmentCollectionComponent, {
                height: '175px',
                width: '400px',
                data: { message },
            })
            .afterClosed();
    }
}
