import { Component, ElementRef, inject, ViewChild, effect, Input, EventEmitter } from '@angular/core';
import { Map, LngLatBounds, Popup } from 'maplibre-gl';
import { FeatureCollection, Point, LineString, Feature } from 'geojson';
import { ActiveCollectionStore } from '../../../stores/active-collection.store';

@Component({
  selector: 'app-equipment-map',
    imports: [
    ],
  templateUrl: './equipment-map.component.html',
  styleUrl: './equipment-map.component.scss'
})
export class EquipmentMapComponent {

    @Input()
    viewEquipment: EventEmitter<string | null> | null | undefined;

    @ViewChild('mapContainer') mapContainer: ElementRef | null | undefined;
    readonly store = inject(ActiveCollectionStore);
    private map: Map | null = null;

    constructor(
    ) {
        this.watchDataChanges();
    }

    ngOnInit() {
        this.subscribeToData();
    }

    ngAfterViewInit() {
        this.buildMap();
    }

    private watchDataChanges(): void {
        effect(() => {
            const data = this.store.data();
            console.log('store data changed...', data);
            if (this.map && this.map.loaded() && data) {
                this.updateEquipmentLayer(data as FeatureCollection);
            }
        });
    }

    private subscribeToData(): void {
        this.viewEquipment?.subscribe((id: string | null) => {
            console.log('view equipment');
            console.log(id);
            if (id) {
                this.zoomToEquipment(id);
            }
            else {
                this.zoomToFeatures(this.store.data() as FeatureCollection);
            }
        })
    }

    private buildMap(): void {
        this.map = new Map({
            container: this.mapContainer?.nativeElement,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [-95.964, 37.237] ,
            zoom: 3.5,
        });

        this.map.on('load', () => {
            this.addEquipmentLayer();
        });
    }

    private updateEquipmentLayer(data: FeatureCollection): void {
        // If source already exists, update it
        if (this.map?.getSource('equipment-source')) {
            const source = this.map.getSource('equipment-source') as any;
            source.setData(data);
            this.zoomToFeatures(data);
        }
        else if (this.map?.loaded()) {
            // Otherwise create it for the first time
            this.addEquipmentLayer();
        }
    }

    private addEquipmentLayer(): void {
        const data = this.store.data();

        if (!this.map || !data) return;

        // Add the GeoJSON source
        this.map.addSource('equipment-source', {
            type: 'geojson',
            data: data as FeatureCollection
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

    private zoomToEquipment(id: string): void {
        if (!this.map) {
            return;
        }
        const data = this.store.data();
        const feature = (data as FeatureCollection).features.find(f => f.id === id);
        if (!feature) {
            return;
        }
        const bounds = this.getBounds(feature);
        // Zoom to the bounds with some padding
        this.map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
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
}
