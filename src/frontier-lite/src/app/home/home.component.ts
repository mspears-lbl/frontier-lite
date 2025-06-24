import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Data, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DataFile, DataFileList, FileSystemService } from '../services/file-system.service';
import { ActiveCollectionStore } from '../stores/active-collection.store';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers: [
    ActiveCollectionStore
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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
        this.loadData();
    }

    private async loadData(): Promise<void> {
        console.log('list the files...');
        this.fileList = await this.fileService.listFiles();
        console.log('files', this.fileList);
    }

    public async loadFile(file: DataFile): Promise<void> {
        console.log('load file', file);
        const data = await this.fileService.readJsonFromFile(file.name);
        console.log('data', data);
    }
}
