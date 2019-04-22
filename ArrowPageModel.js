import { decorate, observable } from "mobx";
import RNSimpleCompass from 'react-native-simple-compass';
import Utils from './Utils';
import Calculate from './Caluclate';
import Geolocation from 'react-native-geolocation-service';

export default class ArrowPageModel {
    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new ArrowPageModel();
        }
        return this.instance;
    }
    
    isShowingDirection = false; // used by 

    destination = { latitude: -1, longitude: -1 };

    // const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
    setDestination(dest) {
        if (dest) {
            // console.log('destination: ' + JSON.stringify(dest));
            this.destination.latitude = dest.lat;
            this.destination.longitude = dest.lng;
            this.isShowingDirection = true;

            const degreeUpdateRate = 3;
            RNSimpleCompass.start(degreeUpdateRate, (degree) => {
                // console.log('degree:' + degree);
                try {
                    Geolocation.getCurrentPosition((position) => {
                        this.setRotate(270 - degree + Calculate.bearing(position.coords.latitude, position.coords.longitude,
                            this.destination.latitude, this.destination.longitude));
                       this.distance = Math.round(Calculate.distance(position.coords.latitude, position.coords.longitude,
                           this.destination.latitude, this.destination.longitude));
                    }, (error) => { console.warn(error); }, { maximumAge: 1000, enableHightAccuracy: true });  
                } catch (exception) {
                    console.warn(exception);
                }

            });
            
        } else {
            // console.log('stopped');
            RNSimpleCompass.stop();
            this.isShowingDirection = false;
        }
    }
    rotate = '270deg'
    setRotate(deg) {
        this.rotate = deg + 'deg';
    }

    radius = 5000;
    getRadius() {
        if (this.radius > 10) {
            return this.radius;
        }
        return undefined;
    }

    predefinedPlaces = [];

    showListViewOnReturn = false;

    location = { latitude: 57.708870, longitude: 11.974560 }
    getLocationAsString() {
        const locationString = this.location.latitude + ',' + this.location.longitude;
        // console.log('locationString: ' + locationString);
        return locationString;
    }

    distance = 0;

    shouldShowClear = false;
}
decorate(ArrowPageModel, {
    isShowingDirection: observable, // is used by swipeNavigationPage reaction
    rotate: observable,
    radius: observable,
    predefinedPlaces: observable,
    location: observable,
    distance: observable,
    shouldShowClear: observable
});
