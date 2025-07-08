import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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
