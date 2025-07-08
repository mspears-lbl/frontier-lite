import { Component, effect, ElementRef, EventEmitter, inject, Input, Output, Signal, ViewChild } from '@angular/core';
import { LngLatBounds, Map, Popup } from 'maplibre-gl';
import { Feature, FeatureCollection, LineString, Point } from 'geojson';
import { EquipmentType, getEquipmentTypeDrawMode } from '../../../models/equipment-type';
import { TerraDraw, TerraDrawPointMode, TerraDrawLineStringMode } from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";
import { LocationFinderComponent } from '../../../location-finder/location-finder/location-finder.component';
import { LocationResult } from '../../../../../../common/models/find-locations';
import { ActiveEquipmentCollectionStore } from '../../stores/active-equipment-collection.store';
import { buildFeatureCollection } from '../../../models/equipment';


@Component({
    selector: 'app-create-equipment-map',
    imports: [
        LocationFinderComponent
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
    equipmentLocation = new EventEmitter<any>();

    @ViewChild('mapContainer') mapContainer: ElementRef | null | undefined;
    private map: Map | null = null;
    private draw: TerraDraw | null | undefined;
    readonly store = inject(ActiveEquipmentCollectionStore);

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
            this.clearDrawnObjects();
        })
    }

    ngAfterViewInit() {
        this.buildMap();
    }

    private buildMap(): void {
        this.map = new Map({
            container: this.mapContainer?.nativeElement,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [-95.964, 37.237],
            zoom: 3.5,
            attributionControl: false
        });

        // configure TerraDraw once the styles have been loaded
        this.map.on('style.load', () => {
            this.configureTerraDraw()
            this.addEquipmentLayer();
        });
    }

    private clearDrawnObjects(): void {
        console.log('clear the map...');
        this.equipmentLocation.emit(undefined);
        this.draw?.clear();
        this.setDrawMode();
    }

    public handleLocationSelect(location: LocationResult): void {
        console.log('zoom to location', location)
        this.zoomToLocation(location);
    }

    private zoomToLocation(location: LocationResult): void {
        if (!this.map) return;
        this.clearDrawnObjects();

        // Try to use mapView bounds first (4-element array: [west, south, east, north])
        if (location.mapView && Array.isArray(location.mapView) && location.mapView.length === 4) {
            const [west, south, east, north] = location.mapView;
            const bounds = new LngLatBounds([west, south], [east, north]);
            this.map.fitBounds(bounds, { padding: 50 });
        }
        // Fallback to lat/lng coordinates
        else if (location.latitude && location.longitude) {
            this.map.flyTo({
                center: [location.longitude, location.latitude],
                zoom: 12
            });
        }
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

    private addEquipmentLayer(): void {
        const equipmentData = this.store.data();
        if (!equipmentData) {
            return;
        }
        const data = buildFeatureCollection(equipmentData);

        if (!this.map || !data) {
            return;
        }

        // Add the GeoJSON source
        this.map.addSource('equipment-source', {
            type: 'geojson',
            data: data
        });

        // Add a layer for points
        this.map.addLayer({
            id: 'equipment-points',
            type: 'circle',
            source: 'equipment-source',
            filter: ['==', '$type', 'Point'],
            paint: {
                'circle-radius': 6,
                'circle-color': '#FF6B6B',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFFFFF'
            }
        });

        // Add a layer for lines
        this.map.addLayer({
            id: 'equipment-lines',
            type: 'line',
            source: 'equipment-source',
            filter: ['==', '$type', 'LineString'],
            paint: {
                'line-color': '#4264FB',
                'line-width': 2
            }
        });

        // Add hover popup functionality
        this.addHoverPopup();

        // Zoom to the features
        this.zoomToFeatures(data as FeatureCollection);
    }

    private addHoverPopup(): void {
        if (!this.map) return;

        // Create a popup but don't add it to the map yet
        const popup = new Popup({
            closeButton: false,
            closeOnClick: false
        });

        // Show popup on mouse enter
        this.map.on('mouseenter', 'equipment-points', (e) => {
            if (!e.features?.length || !this.map) return;

            // Change the cursor style
            this.map.getCanvas().style.cursor = 'pointer';

            const feature = e.features[0];
            const coordinates = (feature.geometry as Point).coordinates.slice();
            const name = feature.properties?.['name'] || 'Unnamed';

            // Populate the popup and set its coordinates
            popup.setLngLat(coordinates as [number, number])
                .setHTML(`<strong>${name}</strong>`)
                .addTo(this.map);
        });

        // Handle line features
        this.map.on('mouseenter', 'equipment-lines', (e) => {
            if (!e.features?.length || !this.map) return;

            // Change the cursor style
            this.map.getCanvas().style.cursor = 'pointer';

            const feature = e.features[0];
            const coordinates = e.lngLat;
            const name = feature.properties?.['name'] || 'Unnamed';

            // Populate the popup and set its coordinates
            popup.setLngLat(coordinates)
                .setHTML(`<strong>${name}</strong>`)
                .addTo(this.map);
        });

        // Remove popup on mouse leave
        this.map.on('mouseleave', 'equipment-points', () => {
            if (!this.map) return;
            this.map.getCanvas().style.cursor = '';
            popup.remove();
        });

        this.map.on('mouseleave', 'equipment-lines', () => {
            if (!this.map) return;
            this.map.getCanvas().style.cursor = '';
            popup.remove();
        });
    }

    private getBounds(feature: Feature, bounds = new LngLatBounds()): LngLatBounds {
        // const bounds = new LngLatBounds();
        if (feature.geometry.type === 'Point') {
            const coords = (feature.geometry as Point).coordinates;
            bounds.extend([coords[0], coords[1]]);
        } else if (feature.geometry.type === 'LineString') {
            (feature.geometry as LineString).coordinates.forEach(coord => {
                bounds.extend([coord[0], coord[1]]);
            });
        }
        return bounds;
    }

    private zoomToFeatures(featureCollection: FeatureCollection): void {
        if (!this.map || !featureCollection.features.length) return;

        // Get source bounds from the map
        const bounds = new LngLatBounds();

        featureCollection.features.forEach(feature => {
            bounds.extend(this.getBounds(feature));
        });
        // featureCollection.features.forEach(feature => {
        //     if (feature.geometry.type === 'Point') {
        //         const coords = (feature.geometry as Point).coordinates;
        //         bounds.extend([coords[0], coords[1]]);
        //     } else if (feature.geometry.type === 'LineString') {
        //         (feature.geometry as LineString).coordinates.forEach(coord => {
        //             bounds.extend([coord[0], coord[1]]);
        //         });
        //     }
        // });

        // Zoom to the bounds with some padding
        this.map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
        });
    }
}
