import { Request, Response } from 'express';
import { db } from '../../db';

export async function getThreatsInBounds(req: Request, res: Response) {
    try {
        const { north, south, east, west } = req.body;

        if (!north || !south || !east || !west) {
            return res.status(400).json({ error: 'Missing required bounds parameters' });
        }

        let query: string;
        let params: number[];

        if (west > east) {
            // Crosses antimeridian - split into two queries
            query = `
                SELECT DISTINCT t.uuid as id, t.name, t.disaster_type_id
                FROM app.threat_geom_polygon tgp
                JOIN app.threat_scenario t ON t.id = tgp.threat_scenario_id
                WHERE ST_Intersects(
                    tgp.geom,
                    ST_Transform(
                        ST_MakeEnvelope($1, $2, 180, $4, 4326),
                        3857
                    )
                ) OR ST_Intersects(
                    tgp.geom,
                    ST_Transform(
                        ST_MakeEnvelope(-180, $2, $3, $4, 4326),
                        3857
                    )
                )
            `;
            params = [west, south, east, north];
        } else {
            // Normal case
            query = `
                SELECT DISTINCT t.uuid as id, t.name, t.disaster_type_id
                FROM app.threat_geom_polygon tgp
                JOIN app.threat_scenario t ON t.id = tgp.threat_scenario_id
                WHERE ST_Intersects(
                    tgp.geom,
                    ST_Transform(
                        ST_MakeEnvelope($1, $2, $3, $4, 4326),
                        3857
                    )
                )
            `;
            params = [west, south, east, north];
        }
        console.log('Bounds:', west, south, east, north, 'Crosses antimeridian:', west > east);

        const result = await db.manyOrNone(query, params);
        
        const threats = (result || []).map(row => ({
            id: row.id,
            name: row.name,
            disasterType: row.disaster_type_id
        }));
        console.log('Threats in bounds:');
        console.log(threats);

        res.json(threats);
    } catch (error) {
        console.error('Error getting threats in bounds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}