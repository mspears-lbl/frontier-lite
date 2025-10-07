import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewEquipmentCollectionService } from '../new-equipment-collection/new-equipment-collectoin.service';
import { DatabaseService } from '../../../services/database.service';
import { EquipmentCollection } from '../../../models/equipment';
import { ConfirmDialogService } from '../../../components/confirm-dialog/confirm-dialog.service';
import { MessageService } from '../../../services/message.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ActiveEquipmentCollectionStore } from '../../stores/active-equipment-collection.store';

interface TableRow {
    id: string;
    name: string;
    ref: EquipmentCollection;
    created: Date;
}

interface TableColumn {
    name: string;
    id: string;
    getValue: (row: TableRow) => any;
}


@Component({
    selector: 'app-equipment-collection-list',
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatMenuModule
    ],
    templateUrl: './equipment-collection-list.component.html',
    styleUrl: './equipment-collection-list.component.scss'
})
export class EquipmentCollectionListComponent {
    readonly activeStore = inject(ActiveEquipmentCollectionStore)

    public columns: TableColumn[] = [
        { id: 'action', name: '', getValue: (row: TableRow) => null },
        { id: 'name', name: 'Name', getValue: (row: TableRow) => row.name },
        { id: 'created', name: 'Created Date', getValue: (row: TableRow) => row.created },
    ];
    public displayedColumns = this.columns.map(item => item.id);
    public dataSource = new MatTableDataSource<TableRow>();

    get hasData(): boolean {
        return this.dataSource.data.length ? true : false;
    }

    constructor(
        private createCollectionService: NewEquipmentCollectionService,
        private dbService: DatabaseService,
        private confirmService: ConfirmDialogService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.loadCollections();
    }

    private async loadCollections(): Promise<void> {
        console.log('get collections...');
        const results = await this.dbService.getEquipmentCollections();
        console.log(results);
        if (results.data) {
            this.setTableData(results.data);
        }
    }

    public createCollection(): void {
        this.createCollectionService.confirm('Create new equipment collection?')
        .subscribe((result: boolean) => {
            if (result) {
                console.log('Create new equipment collection');
                this.loadCollections();
            }
        });
    }

    public loadCollection(item: EquipmentCollection): void {
        console.log(`load collection: ${item.name}`);
        this.activeStore.setData(item);
        this.router.navigate(['..'], {relativeTo: this.route});
    }

    private setTableData(data: EquipmentCollection[]): void {
        this.dataSource.data = [];
        console.log('table data...');
        console.log(data);
        const rows: TableRow[] = [];
        try {
            for (let item of data) {
                const row: TableRow = {
                    id: item.id,
                    name: item.name,
                    created: item.created,
                    ref: item
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
        this.confirmService.confirm('Are you sure you want to delete this equipment group?')
            .subscribe(result => {
                if (result) {
                    this.deleteCollection(id);
                }
            });
    }

    private async deleteCollection(id: string): Promise<void> {
        console.log('delete collection...');
        const result = await this.dbService.deleteEquipmentCollection(id);
        console.log('result')
        console.log(result);
        if (result.success) {
            this.loadCollections();
        }
        else {
            this.messageService.display('Unable to delete the equipment group.');
        }
    }

}
