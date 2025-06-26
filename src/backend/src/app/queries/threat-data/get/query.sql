-- SELECT ST_AsMVT(tile.*) as mvt
-- FROM (
--     SELECT 
--         ts.id,
--         ts.name,
--         ST_AsMVTGeom(
--             ST_Transform(gt.geom, 4326),
--             ST_TileEnvelope(${z}, ${x}, ${y})
--         ) as geom
--     FROM app.threat_geom_polygon as gt
--     JOIN app.threat_scenario as ts on ts.id = gt.threat_scenario_id
--     WHERE ST_Intersects(
--         gt.geom,
--         ST_Transform(ST_TileEnvelope(${z}, ${x}, ${y}), 3857)
--     )
-- ) as tile
-- WHERE tile.geom IS NOT NULL;

WITH
	bbox AS (
		select ST_Extent(ST_TileEnvelope(${z}, ${x}, ${y})) as b2d,
		ST_TileEnvelope(${z}, ${x}, ${y}) as geom
	),

	threat_polygons as (
		select
			ST_AsMVTGeom(gt.geom, bbox.b2d) AS geom,
			case
				when gt.threat_scenario_id = 9 then
					(gt.properties->>'contour')::float8
				else
					(gt.properties->>'paramvalue')::float8
			end as paramvalue,
			str.service_territory_id as "serviceTerritoryId",
			ts.name,
			ts.disaster_type_id as "disasterTypeId"
		from
			app.threat_geom_polygon as gt
		cross join
			bbox
		join
			app.threat_scenario as ts on ts.id = gt.threat_scenario_id
		join
			app.service_territory_region as str on str.id = ts.territory_region_id
		where
			ST_Intersects(gt.geom, bbox.geom)
		-- and
		-- 	gt.threat_scenario_id = ${threatScenarioId}
	),

	threat_layer as (
		select
			ST_AsMVT(threat_polygons.*,'threat-polygons') as mvt
		from
			threat_polygons
	),

	threat_lines as (
		select
			ST_AsMVTGeom(gt.geom, bbox.b2d) AS geom,
			str.service_territory_id as "serviceTerritoryId",
			ts.name,
			ts.disaster_type_id as "disasterTypeId"
		from
			app.threat_geom_line as gt
		cross join
			bbox
		join
			app.threat_scenario as ts on ts.id = gt.threat_scenario_id
		join
			app.service_territory_region as str on str.id = ts.territory_region_id
		where
			ST_Intersects(gt.geom, bbox.geom)
		-- and
		-- 	gt.threat_scenario_id = ${threatScenarioId}
	),

	threat_lines_layer as (
		select
			ST_AsMVT(threat_lines.*,'threat-lines') as mvt
		from
			threat_lines
	),


	concat_layers as (
		select mvt from threat_layer
		union
		select mvt from threat_lines_layer
	)

select
	string_agg(mvt, '') as st_asmvt
from
	concat_layers

;
