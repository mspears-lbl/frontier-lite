import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { getEquipmentTypeName } from '../../../models/equipment-type';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogService } from '../../../components/confirm-dialog/confirm-dialog.service';
import { ActiveEquipmentCollectionStore } from '../../stores/active-equipment-collection.store';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

interface TableRow {
    id: string;
    name: string;
    equipmentTypeName: string;
}

interface TableColumn {
    name: string;
    id: string;
    getValue: (row: TableRow) => any;
}

@Component({
    selector: 'app-equipment-table',
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatMenuModule
    ],
    templateUrl: './equipment-table.component.html',
    styleUrl: './equipment-table.component.scss'
})
export class EquipmentTableComponent {
    private ngUnSubscribe = new Subject<void>();
    readonly store = inject(ActiveEquipmentCollectionStore);

    @Output()
    viewEquipment = new EventEmitter<string>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    get hasData(): boolean {
        return this.dataSource.data.length ? true : false;
    }


    public columns: TableColumn[] = [
        { id: 'action', name: '', getValue: (row: TableRow) => null },
        { id: 'name', name: 'Name', getValue: (row: TableRow) => row.name },
        { id: 'equipmentTypeName', name: 'Type', getValue: (row: TableRow) => row.equipmentTypeName },
    ];
    public displayedColumns = this.columns.map(item => item.id);
    public dataSource = new MatTableDataSource<TableRow>();

    constructor(
        private confirmService: ConfirmDialogService
    ) {
        this.watchDataChanges();
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<TableRow>([]);
        // this.setTableData();
    }

    ngOnDestroy(): void {
        this.ngUnSubscribe.next();
        this.ngUnSubscribe.complete();
    }

    private watchDataChanges(): void {
        effect(() => {
            const data = this.store.data();
            console.log('store data changed...', data);
            if (data) {
                this.setTableData();
            }
        });
    }


    private setTableData(): void {
        const collection = this.store.data();
        this.dataSource.data = [];
        console.log('table collection data...');
        console.log(collection);
        const rows: TableRow[] = [];
        try {
            for (let feature of collection?.data || []) {
                const row: TableRow = {
                    id: String(feature.id),
                    name: feature.name,
                    equipmentTypeName: getEquipmentTypeName(feature.equipmentType)
                };
                rows.push(row);
            }
        } catch (error: any) {
            console.log('error loading table data');
            console.log(error);
        }
        this.dataSource.data = rows;
    }

    public delete(id: string): void {
        console.log(`delete equipment: ${id}`)
        this.confirmService.confirm('Are you sure you want to delete this equipment?')
            .subscribe(result => {
                if (result) {
                    this.store.removeEquipment(id);
                }
            });
    }

    public view(id: string): void {
        this.viewEquipment.emit(id);
    }
}
