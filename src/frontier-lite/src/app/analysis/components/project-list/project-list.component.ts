import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActiveCollectionStore } from '../../../stores/active-collection.store';
import { Subject } from 'rxjs';
import { getEquipmentTypeName } from '../../../models/equipment-type';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogService } from '../../../components/confirm-dialog/confirm-dialog.service';
import { AnalysisProjectStore } from '../../stores/projects-store';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

interface TableRow {
    id: string;
    name: string;
    description: string | null | undefined;
    created: Date;
}

interface TableColumn {
    name: string;
    id: string;
    getValue: (row: TableRow) => any;
}

@Component({
    selector: 'app-project-list',
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
    private ngUnSubscribe = new Subject<void>();
    readonly store = inject(AnalysisProjectStore);

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
        { id: 'description', name: 'Description', getValue: (row: TableRow) => row.description},
        { id: 'created', name: 'Created', getValue: (row: TableRow) => row.created},
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
        const projects = this.store.data();
        this.dataSource.data = [];
        console.log('table collection data...');
        console.log(projects);
        const rows: TableRow[] = [];
        try {
            for (let item of projects || []) {
                const row: TableRow = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    created: item.created
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
        console.log(`delete project: ${id}`)
        this.confirmService.confirm('Are you sure you want to delete this project?')
            .subscribe(result => {
                if (result) {
                    this.store.removeProject(id);
                }
            });
    }

    public view(id: string): void {
        // this.viewEquipment.emit(id);
    }
}
