import { decorate, observable } from "mobx";
import RNSimpleCompass from 'react-native-simple-compass';
import Utils from './Utils';
import Calculate from './Caluclate';
import Geolocation from 'react-native-geolocation-service';
import { magnetometer, gyroscope, accelerometer, deviceMotion, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
/*
import {
    FusionAhrs,
    FusionAhrsUpdate,
    FusionVector3,
    FusionCompassCalculateHeading
} from "./AHRS-Sensors-Fusion-JS/FusionAhrs";
*/
import AHRS from 'ahrs';

// sampleInterval: 0.03925199992954731
// 39.25199992954731 
// beta 8. 7 8
const updateRate = 0.10;
const madgwick = new AHRS({ sampleInterval: updateRate, algorithm: 'Madgwick', beta: 0.4 });
// 23 sec 15 sec with 5 beta
// 15 sec 16 sec with 8 beta
// 13 sec 17 sec with 12 beta
// 18 sec 18 sec with 15 beta
// and with 
export default class ArrowPageModel {
    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new ArrowPageModel();
        }
        return this.instance;
    }

    isShowingDirection = false; // used by 
    // 5
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
    lastG;
    lastTime = 0;
    timeDif;
    interval;
    startCompass() { // May need to write stabilising solution // undvik compass reading om inte rört telefonen // men om står vid en avikelse 
        // compass match ahrs but not when device is started upside down ahrs points the opposite way
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
        */
       const rate = updateRate * 1000; // s to ms 
       // setUpdateIntervalForType(SensorTypes.deviceMotion, 10); // does not go faster than 10 ms - cretes bridge probelem aswell
       setUpdateIntervalForType(SensorTypes.accelerometer, rate);
       setUpdateIntervalForType(SensorTypes.gyroscope, rate);
       setUpdateIntervalForType(SensorTypes.magnetometer, rate);
       
        setUpdateIntervalForType(SensorTypes.deviceMotion, rate);
        // don't use uncalibrated indeed - gived heading depening on phone is orientated when starting
        /*
        magnetometer.subscribe(({ x, y, z, timestamp }) => {
            console.log('mX: ' + x + 'mY: ' + y + 'mZ: ' + z);
            // console.log('magnetometer timestamp: ' + timestamp);
            this.timeDif = (timestamp - this.lastTime);
            this.mX = y;
            this.mY = x; // putting negatie doesnt help
            this.mZ = z;
            this.lastTime = timestamp;
            
            const m = Math.sqrt((x * x) + (y * y) + (z * z));
            console.log('magnetometer: ' + m);
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
        */
       // 1 min 30 sec
       // 40
       // 1 min 35 sec
       // 15 sec yes yes when starting 
       // 1 min 44 sec
       // 113 sev
       // 1 min 20 sec
       // 1:20
       // 1:10
        // CMAttitudeReferenceFrameXArbitraryCorrectedZVertical
        // gives magnetometer of: 8.20421028137207mY: 7.451621055603027mZ: -47.280086517333984. 8.122105598449707mY: 7.295114040374756mZ: -47.91471481323242. 8.78625202178955mY: 7.604227066040039mZ: -47.45717239379883
        // CMAttitudeReferenceFrameXTrueNorthZVertical
        // gives:  8.806000709533691mY: 7.5612993240356445mZ: -48.515380859375. 9.012178421020508mY: 7.593038558959961mZ: -48.88633346557617. 8.808220863342285mY: 7.007899761199951mZ: -48.52046203613281

        // CMAttitudeReferenceFrameXArbitraryCorrectedZVertical && CMAttitudeReferenceFrameXMagneticNorthZVertical snabb
        // CMAttitudeReferenceFrameXTrueNorthZVertical seg vid uppstart

        deviceMotion.subscribe(({ mX, mY, mZ, gX, gY, gZ, aX, aY, aZ, timestamp }) => {
            console.log('mX: ' + mX + 'mY: ' + mY + 'mZ: ' + mZ);
            // console.log('magnetometer timestamp: ' + timestamp);
            this.timeDif = (timestamp - this.lastTime);
            const m = Math.sqrt((mX * mY) + (mY * mY) + (mZ * mZ));
            console.log('mag: ' + m); // 48.452443774749334 uT 
            
            this.mX = mY;
            this.mY = mX;
            this.mZ = mZ;
            
            this.aX = aY;
            this.aY = aX;
            this.aZ = aZ;
            
            this.gX = -gY;
            this.gY = -gX; 
            this.gZ = -gZ; 
                        

            this.lastTime = timestamp;
            
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
        gyroscope.subscribe(({ x, y, z, timestamp }) => {
            // console.log('gX: ' + x + ' gY: ' + y + ' gZ: ' + z);
            
            this.gX = x * (180 / Math.PI);
            this.gY = y * (180 / Math.PI);
            this.gZ = z * (180 / Math.PI);
            
            
           this.gX = -y;
           this.gY = -x;
           this.gZ = -z;
           
            
             is raw gyroscope in radians per second: https://github.com/psiphi75/ahrs/issues/9
            const d = z * (180 / Math.PI);
            if (!this.lastG) this.lastG = d;
            const gDif = Math.abs(this.lastG - d);
            if (gDif >= 1) {    
                this.gZ = Math.round(d);
                this.lastG = d;
            }
            
        });
        */
        /*
        accelerometer.subscribe(({ x, y, z, timestamp }) => {
            // console.log({ x, y, z, timestamp })
            // console.log('aX: ' + x + ' aY: ' + y + ' aZ: ' + z);
            this.aX = y;
            this.aY = x;
            this.aZ = z;
        });
        */
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
        console.log('timedif: ' + this.timeDif);
        // device motion updates stops when app is put in background. react-native-sensors stop sgetting data so the madgwickupdate does not run
        madgwick.update(this.gX, this.gY, this.gZ, this.aX, this.aY, this.aZ, this.mX, this.mY, this.mZ, updateRate);
        // let heading = madgwick.getEulerAnglesDegrees().heading;
        // https://stackoverflow.com/questions/5782658/extracting-yaw-from-a-quaternion
        const q = madgwick.getQuaternion();
        let heading = Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z);
        heading *= (180 / Math.PI); 
        // console.log('quaternion: ' + JSON.stringify(q));
        
        heading %= 360;
        if (heading < 0) {
            heading += 360;
        }
        
        return heading;
    }
    
    // heading from ahrs is counter-clockwise https://github.com/psiphi75/ahrs#readme while degree from simple-compass is clockwise
    // (360 - degree)
    showTheWay(degree) {
        try {
            Geolocation.getCurrentPosition((position) => {
                this.setRotate(270 + degree);  // Calculate.bearing(position.coords.latitude, position.coords.longitude, this.destination.latitude, this.destination.longitude)  // degree positive when using ahrs
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
                this.locationAhead = Calculate.FindPointAtDistanceFrom(position.coords.latitude, position.coords.longitude, -degree, this.getRadius()); // degree negative when using ahrs
                console.log('Found point: ' + JSON.stringify(this.location));
            }, (error) => { console.warn(error); /* show unable to locate icon bad connection */ }, { maximumAge: 300000 }); // 5 min
        } catch (exception) {
            console.warn(exception);
            /* have not turned on permission or other problem */
        }
    }

    stopCompass() {
        RNSimpleCompass.stop();
        clearInterval(this.interval);
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
    h: observable,
    gZ: observable
});
