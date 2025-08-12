import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, NgZone, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ActiveCollectionStore } from '../../stores/active-collection.store';

interface TableRow {
    name: string;
}

interface TableColumn {
    name: string;
    id: string;
    getValue: (row: TableRow) => any;
}

@Component({
    selector: 'app-collection-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
    ],
    providers: [
        ActiveCollectionStore
    ],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss'
})
export class CollectionListComponent {
    private ngUnSubscribe = new Subject<void>();
    readonly store = inject(ActiveCollectionStore);

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;


    public columns: TableColumn[] = [
        {id: 'name', name: 'name', getValue: (row: TableRow) => row.name},
    ];
    public displayedColumns = this.columns.map(item => item.id);
    public dataSource = new MatTableDataSource<TableRow>();

    constructor(
    ) {}

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<TableRow>([]);
    }

    ngOnDestroy(): void {
        this.ngUnSubscribe.next();
        this.ngUnSubscribe.complete();
    }

}
