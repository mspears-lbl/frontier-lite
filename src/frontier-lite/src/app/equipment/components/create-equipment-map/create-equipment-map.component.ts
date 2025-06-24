import { Component, effect, ElementRef, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';
import { Map } from 'maplibre-gl';
import { Feature } from '../../../models/geojson.interface';
import { EquipmentType, getEquipmentTypeDrawMode } from '../../../models/equipment-type';
import { TerraDraw, TerraDrawPointMode, TerraDrawLineStringMode } from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";


@Component({
    selector: 'app-create-equipment-map',
    imports: [
    ],
    templateUrl: './create-equipment-map.component.html',
    styleUrl: './create-equipment-map.component.scss'
})
export class CreateEquipmentMapComponent {

    @Input()
    clear$: EventEmitter<any> | null | undefined;

    @Input()
    equipmentType: Signal<EquipmentType> | null | undefined;

    @Output()
    equipmentLocation = new EventEmitter<Feature>();

    @ViewChild('mapContainer') mapContainer: ElementRef | null | undefined;
    private map: Map | null = null;
    private draw: TerraDraw | null | undefined;

    constructor(
    ) {
        // Subscribe to equipmentType signal changes
        effect(() => {
            this.equipmentLocation.emit(undefined);
            this.draw?.clear();
            this.setDrawMode();
        });
    }

    ngOnInit() {
        this.clear$?.subscribe(() => {
            console.log('clear the map...');
            this.equipmentLocation.emit(undefined);
            this.draw?.clear();
            this.setDrawMode();
        })
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

        // configure TerraDraw once the styles have been loaded
        this.map.on('style.load', () => this.configureTerraDraw());
    }

    private configureTerraDraw(): void {
        const adapter = new TerraDrawMapLibreGLAdapter({
            map: this.map,
        });

        this.draw = new TerraDraw({
            adapter: adapter,
            modes: [new TerraDrawLineStringMode(), new TerraDrawPointMode()],
        });
        this.draw!.start();
        this.setDrawMode();
        this.draw.on('finish', (event) => this.finishDraw(event));
    }

    private setDrawMode(): void {
        if (!this.equipmentType) {
            throw new Error('equipmentType is not defined')
        }
        const drawMode = getEquipmentTypeDrawMode(this.equipmentType())
        console.log(`set the draw mode:`);
        console.log(drawMode);
        this.draw?.setMode(drawMode);
    }

    private finishDraw(event: any): void {
        if (typeof event !== 'string') {
            throw new Error('event is not a string');
        }
        console.log('finishDraw');
        console.log(event);
        const features = this.draw?.getSnapshotFeature(event);
        this.equipmentLocation.emit(features);
        this.draw?.setMode('static');
        console.log('features');
        console.log(features);
    }

}
