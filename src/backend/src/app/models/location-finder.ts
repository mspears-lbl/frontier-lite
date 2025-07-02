import { GeoPlacesClient, SearchTextCommand } from '@aws-sdk/client-geo-places';
import { fromEnv } from '@aws-sdk/credential-providers';
import * as util from 'util'
import { LocationResult } from '../../../../common/models/find-locations';

/** Determines if the AWS environment variables have been set. */
const hasEnvCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID
    ? true : false;

const client = hasEnvCredentials
    ? new GeoPlacesClient({
        region: "us-west-2",
        credentials: fromEnv(),
    })
    : new GeoPlacesClient({
        region: "us-west-2",
    });




export async function findLocations(
    query: string
): Promise<LocationResult[]> {
    try {
        const command = new SearchTextCommand({
            QueryText: query,
            MaxResults: 5,
            BiasPosition: [-122.4194, 37.7749], // San Francisco coordinates as default bias
        });

        const response = await client.send(command);
        console.log(util.inspect(response, {depth: null}))

        return response.ResultItems?.map(item => ({
            name: item.Title || '',
            latitude: item.Position?.[1] || 0,
            longitude: item.Position?.[0] || 0,
            mapView: item.MapView
        })) || [];
    } catch (error) {
        console.error('Error searching locations:', error);
        throw new Error('Failed to search locations');
    }
}