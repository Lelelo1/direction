import { decorate, observable } from "mobx";
import RNSimpleCompass from 'react-native-simple-compass';
import Utils from './Utils';

export default class ArrowPageModel {
    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new ArrowPageModel();
        }
        return this.instance;
    }
    
    isShowingDirection = false;

    // const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
    setDestination(location) {
        if (location) {
            this.isShowingDirection = true;
            const degreeUpdateRate = 3;
            /*
            RNSimpleCompass.start(degreeUpdateRate, (degree) => {
                // console.log('degree:' + degree);
                this.setRotate(270 - degree);
            });
            */
        } else {
            console.log('stopped');
            // RNSimpleCompass.stop();
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
}
decorate(ArrowPageModel, {
    isShowingDirection: observable, // is used by swipeNavigationPage reaction
    rotate: observable,
    radius: observable,
    predefinedPlaces: observable
});
