import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map } from 'maplibre-gl';
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw'
import { FeatureCollection } from 'geojson';
import { FileSystemService } from '../../services/file-system.service';

@Component({
    selector: 'app-equipment-def-map',
    imports: [
    ],
    templateUrl: './equipment-def-map.component.html',
    styleUrl: './equipment-def-map.component.scss'
})
export class EquipmentDefMapComponent {
    @ViewChild('mapContainer') mapContainer: ElementRef | null | undefined;
    private draw: MaplibreTerradrawControl | null = null;
    private map: Map | null = null;

    // Store the GeoJSON data of all drawn shapes
    private drawnFeatures: FeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };

    constructor(
        private fileService: FileSystemService
    ) {
    }

    ngAfterViewInit() {
        this.buildMap();
    }

    private buildMap(): void {
        this.map = new Map({
            container: this.mapContainer?.nativeElement,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [-95.964, 37.237] ,
            zoom: 3.5,
        });

        // As default, all Terra Draw modes are enabled,
        // you can disable options if you don't want to use them.
        this.draw = new MaplibreTerradrawControl({
            modes: ['render','point','linestring','polygon','rectangle','circle','freehand','angled-rectangle','sensor','sector','select','delete-selection','delete','download'],
            open: true,
        });

        this.map.addControl(this.draw, 'top-left');

        // Listen for Terradraw events to track changes
        this.setupDrawEvents();
    }

    private setupDrawEvents(): void {
        if (!this.draw || !this.map) return;

        // Listen for feature changes using the control's events
        const inst = this.draw.getTerraDrawInstance();
        inst.on('finish', async (event) => {
            console.log('Feature finish event:', event);
            console.log('features', this.draw?.getFeatures())
            // await this.fileService.writeJsonToFile('test.geojson', this.draw?.getFeatures());
            // Get the app's user data directory
            console.log('write the file...');
            const result = await this.fileService.writeJsonToFile('test.geojson', this.draw?.getFeatures());
            // const result = await this.fileService.saveData(this.draw?.getFeatures());
            console.log(result);

            // Log the full path to the console
            // if (result.success) {
            //     console.log('File saved successfully at:', result.filePath);
            // } else {
            //     console.error('Failed to save file:', result.error);
            // }
        })
        // inst.on('change', (event) => {
        //     console.log('Feature change event:', event);
        // });
        // this.draw.on('create', () => {
        //     this.updateDrawnFeatures();
        // });

        // this.draw.on('update', () => {
        //     this.updateDrawnFeatures();
        // });

        // this.draw.on('delete', () => {
        //     this.updateDrawnFeatures();
        // });
    }

    // // Update the stored GeoJSON whenever shapes change
    // private updateDrawnFeatures(): void {
    //     if (!this.draw) return;

    //     // Get the GeoJSON directly from the control
    //     this.drawnFeatures = this.draw.getAll();
    //     console.log('Current GeoJSON features:', this.drawnFeatures);
    // }

    // // Public method to get the current GeoJSON data
    // public getDrawnFeatures(): FeatureCollection {
    //     return this.drawnFeatures;
    // }
}
