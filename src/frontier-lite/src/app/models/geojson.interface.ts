/**
 * TypeScript interfaces for GeoJSON objects
 * Based on the GeoJSON specification (RFC 7946)
 */

// Base GeoJSON object interface
export interface GeoJSON {
  type: string;
  bbox?: number[];
}

// Position is a fundamental geometry construct - [longitude, latitude, elevation?]
export type Position = number[];

// Point geometry
export interface Point extends GeoJSON {
  type: 'Point';
  coordinates: Position;
}

// MultiPoint geometry
export interface MultiPoint extends GeoJSON {
  type: 'MultiPoint';
  coordinates: Position[];
}

// LineString geometry
export interface LineString extends GeoJSON {
  type: 'LineString';
  coordinates: Position[];
}

// MultiLineString geometry
export interface MultiLineString extends GeoJSON {
  type: 'MultiLineString';
  coordinates: Position[][];
}

// Polygon geometry
export interface Polygon extends GeoJSON {
  type: 'Polygon';
  coordinates: Position[][];
}

// MultiPolygon geometry
export interface MultiPolygon extends GeoJSON {
  type: 'MultiPolygon';
  coordinates: Position[][][];
}

// GeometryCollection
export interface GeometryCollection extends GeoJSON {
  type: 'GeometryCollection';
  geometries: Geometry[];
}

// Union type for all geometry types
export type Geometry = 
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon
  | GeometryCollection;

// Feature object
export interface Feature<G extends Geometry | null = Geometry, P = any> extends GeoJSON {
  type: 'Feature';
  geometry: G;
  properties: P;
  id?: string | number;
}

// FeatureCollection object
export interface FeatureCollection<G extends Geometry | null = Geometry, P = any> extends GeoJSON {
  type: 'FeatureCollection';
  features: Feature<G, P>[];
}