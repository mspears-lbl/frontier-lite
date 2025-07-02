import { Component, ElementRef, inject, ViewChild, effect, Input, EventEmitter, Output } from '@angular/core';
import { Map as GlMap, LngLatBounds, Popup } from 'maplibre-gl';
import { FeatureCollection, Point, LineString, Feature } from 'geojson';
import { ActiveCollectionStore } from '../../../stores/active-collection.store';
import { ThreatDataService } from '../../services/threat-data.service';
import { ThreatInfo } from '../../../../../../common/models/threat-info';
import { LocationResult } from '../../../../../../common/models/find-locations';

@Component({
  selector: 'app-threat-map',
    imports: [
    ],
  templateUrl: './threat-map.component.html',
  styleUrl: './threat-map.component.scss'
})
export class ThreatMapComponent {

    @Input()
    viewEquipment: EventEmitter<string | null> | null | undefined;

    @Input()
    viewThreat: EventEmitter<string> | null | undefined;

    @Input()
    viewLocation: EventEmitter<LocationResult> | null | undefined;

    @Output()
    threatInfoEvent = new EventEmitter<ThreatInfo[]>;

    @ViewChild('mapContainer') mapContainer: ElementRef | null | undefined;
    readonly store = inject(ActiveCollectionStore);
    private threatDataService = inject(ThreatDataService);
    private map: GlMap | null = null;
    private consolidatedThreats = new Set<string>();
    private boundsThreats = new Set<string>();

    private threatSourceID = 'threat-source' as const;
    private threatLayerID = 'threat-layer' as const;

    constructor(
    ) {
        this.watchDataChanges();
    }

    ngOnInit() {
        this.subscribeToData();
        this.subscribeToViewThreat();
        this.subscribeToViewLocation();
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

    private subscribeToViewThreat(): void {
        this.viewThreat?.subscribe(id => {
            console.log(`view the threat ${id}`);
            this.removeThreatFromMap();
            this.addThreatSource(id);
        })
    }

    private addThreatSource(id: string): void {
        this.map?.addSource(this.threatSourceID,  {
            type: 'vector',
            tiles: [`http://localhost:3000/api/threat-data/{z}/{x}/{y}.mvt/${id}`]
        })
        // Add layer to display threats
        this.map?.addLayer({
            id: this.threatLayerID,
            type: 'fill',
            source: this.threatSourceID,
            'source-layer': 'threat-polygons',
            paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.8,
                'fill-outline-color': '#000000'
            }
        });

        // Wait for tiles to load then zoom to threat
        this.map?.on('sourcedata', (e) => {
            if (e.sourceId === this.threatSourceID && e.isSourceLoaded) {
                this.zoomToThreat();
            }
        });
    }

    private removeThreatFromMap(): void {
        if (this.map?.getLayer(this.threatLayerID)) {
            this.map?.removeLayer(this.threatLayerID);
        }
        if (this.map?.getSource(this.threatSourceID)) {
            this.map?.removeSource(this.threatSourceID);
        }
    }

    private zoomToThreat(): void {
        if (!this.map || !this.map.getLayer(this.threatLayerID)) return;

        const features = this.map.queryRenderedFeatures({ layers: [this.threatLayerID] });
        if (!features.length) return;

        const bounds = new LngLatBounds();
        features.forEach(feature => {
            bounds.extend(this.getBounds(feature));
        });
        this.map.fitBounds(bounds, { padding: 50 });
    }

    private subscribeToViewLocation(): void {
        this.viewLocation?.subscribe((location: LocationResult) => {
            console.log('view location');
            console.log(location);
            this.zoomToLocation(location);
        })
    }

    private zoomToLocation(location: LocationResult): void {
        if (!this.map) return;
        this.removeThreatFromMap();

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

    private buildMap(): void {
        this.map = new GlMap({
            container: this.mapContainer?.nativeElement,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [-95.964, 37.237] ,
            zoom: 3.5,
            attributionControl: false
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
        }
        else if (this.map?.loaded()) {
            // Otherwise create it for the first time
            this.addEquipmentLayer();
        }
    }

    private addEquipmentLayer(): void {
        const data = this.store.data();

        if (!this.map || !data) return;

        // this.map.addSource('threats-source', {
        //     type: 'vector',
        //     tiles: ['http://localhost:3000/api/threat-data/{z}/{x}/{y}.mvt']
        // });

        // // Add layer to display threats
        // this.map.addLayer({
        //     id: 'threats-layer',
        //     type: 'fill',
        //     source: 'threats-source',
        //     'source-layer': 'threat-polygons',
        //     paint: {
        //         'fill-color': '#ff0000',
        //         'fill-opacity': 0.8,
        //         'fill-outline-color': '#000000'
        //     }
        // });

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

        // Add bounds-based threat tracking
        this.addBoundsTracking();

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

    private addBoundsTracking(): void {
        if (!this.map) return;

        // Track map view changes
        this.map.on('moveend', () => {
            this.updateThreatsFromBounds();
        });

        // Initial load
        this.updateThreatsFromBounds();
    }

    private updateThreatsFromBounds(): void {
        if (!this.map) return;

        const bounds = this.map.getBounds();
        const boundsData = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: this.normalizeLongitude(bounds.getEast()),
            west: this.normalizeLongitude(bounds.getWest())
        };

        this.threatDataService.getThreatsInBounds(boundsData)
            .subscribe({
                next: (threats) => {
                    console.log('Bounds-based threats:', threats);
                    this.boundsThreats.clear();
                    threats.forEach(threat => {
                        this.boundsThreats.add(JSON.stringify(threat));
                    });
                    this.threatInfoEvent.emit(threats);

                    // Emit both MVT and bounds-based threats for comparison
                    // const allThreats = new Set([...this.consolidatedThreats, ...this.boundsThreats]);
                    // console.log('Combined threats (MVT + Bounds):', Array.from(allThreats).map(t => JSON.parse(t)));
                },
                error: (error) => {
                    console.error('Error fetching bounds-based threats:', error);
                }
            });
    }

    private normalizeLongitude(lng: number): number {
        return ((lng + 180) % 360 + 360) % 360 - 180;
    }

    private getBounds(feature: Feature, bounds = new LngLatBounds()): LngLatBounds {
        // const bounds = new LngLatBounds();
        if (feature.geometry.type === 'Point') {
            const coords = (feature.geometry as Point).coordinates;
            bounds.extend([coords[0], coords[1]]);
        }
        else if (feature.geometry.type === 'LineString') {
            (feature.geometry as LineString).coordinates.forEach(coord => {
                bounds.extend([coord[0], coord[1]]);
            });
        }
        else if (
            feature.geometry.type === 'Polygon' ||
            feature.geometry.type === 'MultiPolygon'
        ) {
            const coords = feature.geometry.type === 'Polygon'
                ? [feature.geometry.coordinates]
                : feature.geometry.coordinates;
            coords.forEach(polygon => {
                polygon[0].forEach(coord => {
                    bounds.extend([coord[0], coord[1]]);
                });
            });
        }
        return bounds;
    }

}
