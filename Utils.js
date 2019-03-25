
/**
 * CANT USE beacuse can't get values from geolocation. asycn await not working.
 * promise not working.
 * https://stackoverflow.com/questions/6847697/how-to-return-value-from-an-asynchronous-callback-function
 */

import Geolocation from 'react-native-geolocation-service';

export default class Utils {
    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new Utils();
        }
        return this.instance;
    }
    key = 'AIzaSyBIHuu2CVqTKLmahKCE4wmHL3dStmIuViY'
    getLocation() {
        let location = null;
        const hasLocationPermission = true;
        if (hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log('position: ' + JSON.stringify(position));
                    console.log('c:' + JSON.stringify(position.coords));
                    location = position.coords;
                    /**
                     * hhshshhhashshshshs
                     */
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                    location = null;
                },
                // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            console.log('did not have permission for geolocation request');
            location = null;
        }
        console.log('start')
        kokaSoppa().then((res) => { hshshs}).then()
        console.log('stopp');

        return location;
    }
    /*
    Geolocation.getCurrentPosition(
        position => convertCoords(position),
        error => this.setState({
            error: error.message
        }), {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        },
    )
    */
    getAddress(location) {
        if (location) {
            if (location.latitude && location.longitude) {
                return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${this.key}`);
            }
            console.log('Could not get address from undefined location');
        }
        return Promise.resolve(undefined);
    }
}

/**
 * Android set up
 * https://github.com/Agontuk/react-native-geolocation-service
 */