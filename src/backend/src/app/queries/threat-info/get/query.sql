
WITH
	bbox AS (
		select ST_Extent(ST_TileEnvelope(${z}, ${x}, ${y})) as b2d,
		ST_TileEnvelope(${z}, ${x}, ${y}) as geom
	),

	threat_polygons as (
		select
			distinct
			ts.id,
			ts.name,
			ts.disaster_type_id as "disasterType"
		from
			app.threat_geom_polygon as gt
		cross join
			bbox
		join
			app.threat_scenario as ts on ts.id = gt.threat_scenario_id
		where
			ST_Intersects(gt.geom, bbox.geom)
	),

	threat_lines as (
		select
			distinct
			ts.id,
			ts.name,
			ts.disaster_type_id as "disasterType"
		from
			app.threat_geom_line as gt
		cross join
			bbox
		join
			app.threat_scenario as ts on ts.id = gt.threat_scenario_id
		where
			ST_Intersects(gt.geom, bbox.geom)
	),

	concat_layers as (
		select id, name, "disasterType" from threat_polygons
		union
		select id, name, "disasterType" from threat_lines
	)

select
	*
from
	concat_layers

;
