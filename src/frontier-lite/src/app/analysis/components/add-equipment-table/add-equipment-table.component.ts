import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { getEquipmentTypeName } from '../../../models/equipment-type';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogService } from '../../../components/confirm-dialog/confirm-dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ActiveEquipmentCollectionStore } from '../../../equipment/stores/active-equipment-collection.store';
import { SelectionModel } from '@angular/cdk/collections';

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
    selector: 'app-add-equipment-table',
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatMenuModule
    ],
    templateUrl: './add-equipment-table.component.html',
    styleUrl: './add-equipment-table.component.scss'
})
export class AddEquipmentTableComponent {
    private ngUnSubscribe = new Subject<void>();
    readonly store = inject(ActiveEquipmentCollectionStore);

    @Output()
    viewEquipment = new EventEmitter<string>();

    @Output()
    equipmentSelected = new EventEmitter<string | null | undefined>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    get hasData(): boolean {
        return this.dataSource.data.length ? true : false;
    }

    get hasSelection(): boolean {
        return this.selection.hasValue();
    }


    public columns: TableColumn[] = [
        { id: 'action', name: '', getValue: (row: TableRow) => null },
        { id: 'name', name: 'Name', getValue: (row: TableRow) => row.name },
        { id: 'equipmentTypeName', name: 'Type', getValue: (row: TableRow) => row.equipmentTypeName },
    ];
    public displayedColumns = this.columns.map(item => item.id);
    public dataSource = new MatTableDataSource<TableRow>();
    public selection = new SelectionModel<TableRow>(false, []);

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

    public toggleSelection(row: TableRow): void {
        this.selection.toggle(row);
        const isSelected = this.selection.isSelected(row);
        this.equipmentSelected.emit(isSelected ? row.id : null);
    }

}
