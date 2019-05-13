import { decorate, observable } from "mobx";
import RNSimpleCompass from 'react-native-simple-compass';
import Utils from './Utils';
import Calculate from './Caluclate';
import Geolocation from 'react-native-geolocation-service';
import { magnetometer, gyroscope, accelerometer, deviceMotion } from 'react-native-sensors';
import {
    FusionAhrs,
    FusionAhrsUpdate,
    FusionVector3,
    FusionCompassCalculateHeading
} from "./AHRS-Sensors-Fusion-JS/FusionAhrs";

import AHRS from 'ahrs';

const madgwick = new AHRS({ sampleInterval: 20, algorithm: 'Madgwick', beta: 0.4 });

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
    mX;
    mY;
    mZ;
    gX;
    gY;
    gZ;
    aX;
    aY;
    aZ;

    lastH;
    startCompass() { // May need to write stabilising solution // undvik compass reading om inte rört telefonen // men om står vid en avikelse 
        /*
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
        */
       
        // don't use uncalibrated
        
        magnetometer.subscribe(({ x, y, z, timestamp }) => {
            // console.log('mX: ' + x + 'mY: ' + y + 'mZ: ' + z);
            this.mX = x;
            this.mY = y;
            this.mZ = z;

            // all sensors has given data
            if (this.mX && this.mY && this.mZ &&
                this.gX && this.gY && this.gZ &&
                 this.aX && this.aY && this.aZ) {
                   const h = this.getHeading();
                   if (this.isShowingDirection) { // fires every time magnet change
                       if (!this.lastVal) this.lastVal = h;
                       const valDif = Math.abs(this.lastVal - h);
                       if (valDif >= 1) {
                           this.showTheWay(h);
                           this.heading = Math.round(h);
                           this.lastVal = h;
                       }
                   } else { // this.isShowingResultsWhereFacing
                       // fire every 20 degree change or something
                       // ...
                       // --> changes this.location updates googleplacesautocomplete
                       // stops when closing listview
                       
                   }
                   if (this.shouldCalculatePointWhereFacing) {
                       if (!this.lastVal) this.lastVal = h;
                       const valDif = Math.abs(this.lastVal - h);
                       if (valDif >= 15) {
                           console.log('turned 15 degree or more');
                           this.showResultsWhereFacing(h);
                           this.lastVal = h;
                       }
                   }
                 }
        });
        
        /*
        deviceMotion.subscribe(({ mX, mY, mZ, aX, aY, aZ, gX, gY, gZ, timestamp }) => {
            
            console.log('mX: ' + mX + ' mY: ' + mY + ' mZ: ' + mZ +
                ' aX: ' + aX + ' aY: ' + aY + ' aZ: ' + aZ +
                ' gX: ' + gX + ' gY: ' + gY + ' gZ: ' + gZ);
            

            // this.mX = mX;
            // this.mY = mY;
            // this.mZ = mZ;
            
            this.aX = aX;
            this.aY = aY;
            this.aZ = aZ;

            this.gX = gX;
            this.gY = gY;
            this.gZ = gZ;
            
            const d = gZ * (180/Math.PI);
            if (!this.lastH) this.lastH = d;
            const hDif = Math.abs(this.lastH - d);
            if (hDif >= 1) {
                this.h = Math.round(d);
                this.lastH = d;
            }

            
        });
        */
        
        gyroscope.subscribe(({ x, y, z, timestamp }) => {
            // console.log('gX: ' + x);
            this.gX = x;
            this.gY = y;
            this.gZ = z;

        });
        
        
        accelerometer.subscribe(({ x, y, z, timestamp }) => {
            // console.log({ x, y, z, timestamp })
            this.aX = x;
            this.aY = y;
            this.aZ = z;
        });
        
        /*
        console.log(JSON.stringify(FusionVector3));
        let v = JSON.parse(FusionVector3);
        v.axis.y = 390;
        console.log(JSON.stringify(v));
        */
    }
    getHeading() {

        /* spinning inaccurate not updating - with device motion completely off not updating when turning https://github.com/xonoxitron/AHRS-Sensors-Fusion-JS
        console.log('getting heading');
        const fusionAhrs = JSON.parse(FusionAhrs);

        const m = JSON.parse(FusionVector3);
        m.axis.x = this.mX;
        m.axis.y = this.mY;
        m.axis.z = this.mZ;

        const g = JSON.parse(FusionVector3);
        g.axis.x = this.gX;
        g.axis.y = this.gY;
        g.axis.z = this.gZ;

        const a = JSON.parse(FusionVector3);
        a.axis.x = this.aX;
        a.axis.y = this.aY;
        a.axis.z = this.aZ;

        const heading = FusionCompassCalculateHeading(a, m);
        // FusionAhrsUpdate(fusionAhrs, gyroscope, accelerometer, magnetometer, 0.01); // assumes 100 Hz sample rate
        // FusionAhrsUpdate(fusionAhrs, gyroscope, accelerometer, FUSION_VECTOR3_ZERO, 0.01); // alternative function call to ignore magnetometer
        // FusionAhrsUpdate(fusionAhrs, gyroscope, FUSION_VECTOR3_ZERO, FUSION_VECTOR3_ZERO, 0.01); // alternative function call to ignore accelerometer and magnetometer
        */
        madgwick.update(this.gX, this.gY, this.gZ, this.aX, this.aY, this.aZ, this.mX, this.mY, this.mZ);
        let heading = madgwick.getEulerAnglesDegrees().heading;
        heading %= 360;

        if (heading < 0) {
            heading += 360;
        }
        console.log('heading: ' + heading);
        return heading;
    }
    // heading from ahrs is counter-clockwise https://github.com/psiphi75/ahrs#readme while degree from simple-compass is clockwise
    // (360 - degree)
    showTheWay(degree) {
        try {
            Geolocation.getCurrentPosition((position) => {
                this.setRotate(270 - degree); // Calculate.bearing(position.coords.latitude, position.coords.longitude, this.destination.latitude, this.destination.longitude)
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

        Object.keys(query).forEach((key) => { if(query[key] === undefined) delete query[key]}); // filer undefined properties
        console.log('filtered query: ' + JSON.stringify(query));
        return query;
    }
    isShowingResultsWhereFacing = false;
    shouldCalculatePointWhereFacing = false;
    // for giving results where user is facing
    heading;
    h;
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
    heading: observable,
    h: observable
});
