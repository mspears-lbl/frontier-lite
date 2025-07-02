import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActiveCollectionStore } from '../../../stores/active-collection.store';
import { Subject } from 'rxjs';
import { getEquipmentTypeName } from '../../../models/equipment-type';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogService } from '../../../components/confirm-dialog/confirm-dialog.service';
import { ThreatInfo } from '../../../../../../common/models/threat-info';
import { getDisasterName } from '../../../../../../common/models/disaster-type';

interface TableRow {
    id: string;
    name: string;
    disasterTypeName: string;
}

interface TableColumn {
    name: string;
    id: string;
    getValue: (row: TableRow) => any;
}

@Component({
    selector: 'app-threat-table',
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './threat-table.component.html',
    styleUrl: './threat-table.component.scss'
})
export class ThreatTableComponent {
    private ngUnSubscribe = new Subject<void>();
    readonly store = inject(ActiveCollectionStore);

    @Input()
    threatInfo$: EventEmitter<ThreatInfo[]> | null | undefined;

    @Output()
    viewThreatEvent = new EventEmitter<string>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    get hasData(): boolean {
        return this.dataSource.data.length ? true : false;
    }


    public columns: TableColumn[] = [
        { id: 'action', name: '', getValue: (row: TableRow) => null },
        { id: 'name', name: 'Name', getValue: (row: TableRow) => row.name },
        { id: 'disasterTypeName', name: 'Type', getValue: (row: TableRow) => row.disasterTypeName },
    ];
    public displayedColumns = this.columns.map(item => item.id);
    public dataSource = new MatTableDataSource<TableRow>();

    constructor(
        // private confirmService: ConfirmDialogService
    ) {
        // this.watchDataChanges();
    }

    ngOnInit() {
        console.log('threat table init...')
        console.log(this.threatInfo$)
        this.dataSource = new MatTableDataSource<TableRow>([]);
        this.threatInfo$?.subscribe((threats: ThreatInfo[]) => {
            console.log('threats for table:', threats);
            this.setTableData(threats);
        })
    }

    ngOnDestroy(): void {
        this.ngUnSubscribe.next();
        this.ngUnSubscribe.complete();
    }

    private setTableData(data: ThreatInfo[]): void {
        this.dataSource.data = [];
        console.log('table data...');
        console.log(data);
        const rows: TableRow[] = [];
            for (let item of data) {
                const row: TableRow = {
                    id: item.id,
                    name: item.name,
                    disasterTypeName: getDisasterName(item.disasterType)
                };
                rows.push(row);
            }
        this.dataSource.data = rows;
    }

    // public delete(id: string): void {
    //     console.log(`delete equipment: ${id}`)
    //     this.confirmService.confirm('Are you sure you want to delete this equipment?')
    //         .subscribe(result => {
    //             if (result) {
    //                 this.store.removeEquipment(id);
    //             }
    //         });
    // }

    public view(id: string): void {
        console.log('view the layer', id)
        this.viewThreatEvent.emit(id);
    }

}
