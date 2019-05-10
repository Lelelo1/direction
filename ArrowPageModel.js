import { decorate, observable } from "mobx";
import RNSimpleCompass from 'react-native-simple-compass';
import Utils from './Utils';
import Calculate from './Caluclate';
import Geolocation from 'react-native-geolocation-service';
import { Attitude, Barometer } from 'react-native-attitude';

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
            this.startCompass();
        } else {
            // console.log('stopped');
            this.stopCompass();
            this.isShowingDirection = false;
        }
    }
    lastVal;
    startCompass() { // May need to write stabilising solution // undvik compass reading om inte rört telefonen // men om står vid en avikelse 
        const degreeUpdateRate = 3;
        RNSimpleCompass.start(degreeUpdateRate, (degree) => {
            // console.log('degree:' + degree);
            if (this.isShowingDirection) { // fires every time magnet change
                this.showTheWay(degree);
            } else { // this.isShowingResultsWhereFacing
                // fire every 20 degree change or something
                // ...
                // --> changes this.location updates googleplacesautocomplete
                // stops when closing listview
                
            }
            if (this.shouldCalculatePointWhereFacing) {
                if (!this.lastVal) this.lastVal = degree;
                const valDif = Math.abs(this.lastVal - degree);
                if (valDif >= 15) {
                    console.log('turned 15 degree or more');
                    this.showResultsWhereFacing(degree);
                    this.lastVal = degree;
                }
            }
        });
        console.log('started compass');
    }

    showTheWay(degree) {
        try {
            Geolocation.getCurrentPosition((position) => {
                this.setRotate(270 - degree + Calculate.bearing(position.coords.latitude, position.coords.longitude,
                    this.destination.latitude, this.destination.longitude));
                this.distance = Math.round(Calculate.distance(position.coords.latitude, position.coords.longitude,
                    this.destination.latitude, this.destination.longitude));
            }, (error) => { console.warn(error); /* show unable to locate icon bad connection */ }, { maximumAge: 1000, enableHightAccuracy: true, distanceFilter: 10 });
        } catch (exception) {
            console.warn(exception);
            /* have not turned on permission or other problem */
        }
    }

    showResultsWhereFacing(degree) {
        try {
            Geolocation.getCurrentPosition((position) => {
                this.locationAhead = Calculate.FindPointAtDistanceFrom(position.coords.latitude, position.coords.longitude, degree, this.getRadius());
                console.log('Found point: ' + JSON.stringify(this.location));
            }, (error) => { console.warn(error); /* show unable to locate icon bad connection */ }, { maximumAge: 300000 }); // 5 min
        } catch (exception) {
            console.warn(exception);
            /* have not turned on permission or other problem */
        }
    }

    stopCompass() {
        RNSimpleCompass.stop();
        console.log('stopped compass');
    }

    rotate = '270deg'
    setRotate(deg) {
        this.rotate = deg + 'deg';
    }

    radius = 5000;
    getRadius() {
        if (this.radius > 10) {
            if (this.shouldCalculatePointWhereFacing) {
                return this.radius / 2;
            }
            return this.radius;
        }
        return undefined; // is unspecified in settings
    }

    predefinedPlaces = [];

    showListViewOnReturn = false;

    location = { latitude: 57.708870, longitude: 11.974560 }

    locationAhead;

    getLocationAsString(location) {
        if (location) {
            return location.latitude + ',' + location.longitude;
        } return undefined;
    }
    distance = 0;

    shouldShowClear = false;

    api = 'GooglePlacesAutocomplete';

    getQuery() {
        /*
        if (this.api === 'GooglePlacesAutocomplete') {
            
        }
        ... when supporting further apis
        */
        const query = {
            key: Utils.getInstance().key,
            radius: this.getRadius(),
            location: this.isShowingResultsWhereFacing ? this.getLocationAsString(this.locationAhead) : this.getLocationAsString(this.location),
            strictbounds: this.getRadius ? 'strictbounds' : undefined,
            sessiontoken: 'aqse34fr5hnj78l9g4s2svfbm377912kde'
        };

        Object.keys(query).forEach((key) => { if (query[key] === undefined) delete query[key]; }); // filer undefined properties
        console.log('filtered query: ' + JSON.stringify(query));
        return query;
    }
    isShowingResultsWhereFacing = false;
    shouldCalculatePointWhereFacing = false;
    // for giving results where user is facing
    attitudeListener;
    headingListener;
    startAttitude() {
        this.attitudeListener = Attitude.watchAttitude((update) => {
            /**
             * update.roll (in degrees -180 (left) +180 (right))
             * update.pitch (in degrees  -90 (down) +90 (up))
            **/
           console.log('update: ' + JSON.stringify(update));
            const r = Math.round(update.attitude.roll);
            const p = Math.round(update.attitude.pitch);

            console.log('roll: ' + r + ' pitch: ' + p);
            this.roll = r;
            this.pitch = p;
        });

        /* uses compass activly
        this.headingListener = Attitude.watchHeading((update) => {

           const h = Math.round(update.heading);
           this.heading = h;
        });
        */
    }
    stopAttitude() {
        Attitude.stopObserving();
        Attitude.clearWatchAttitude(this.attitudeListener);
    }
    roll;
    pitch;
    heading;
}
decorate(ArrowPageModel, {
    isShowingDirection: observable, // is used by swipeNavigationPage reaction
    rotate: observable,
    radius: observable,
    predefinedPlaces: observable,
    location: observable,
    distance: observable,
    shouldShowClear: observable,
    isShowingResultsWhereFacing: observable,
    locationAhead: observable,
    roll: observable,
    pitch: observable,
    heading: observable
});
