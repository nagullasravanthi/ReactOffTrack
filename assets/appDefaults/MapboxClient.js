import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import { MAPBOX_ACCESS_TOKEN } from './appConstants';


const clientOptions = {accessToken: MAPBOX_ACCESS_TOKEN};
const directionsClient = MapboxDirectionsFactory(clientOptions);

export {directionsClient};
