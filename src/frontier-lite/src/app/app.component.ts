import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ActiveCollectionStore } from './stores/active-collection.store';
import { DataFile, DataFileList, FileSystemService } from './services/file-system.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    readonly store = inject(ActiveCollectionStore);

    private fileList: DataFileList | null | undefined;
    get files(): DataFile[] {
        return this.fileList?.files || [];
    }


    constructor(
        private fileService: FileSystemService
    ) {
    }

    ngOnInit() {
        this.loadEquipmentFromFile();
    }

    private async loadEquipmentFromFile() {
        const results = await this.fileService.readEquipmentFromFile();
        console.log('existing data', results);
        if (results.data) {
            this.store.setData(results.data);
        }
    }

}
