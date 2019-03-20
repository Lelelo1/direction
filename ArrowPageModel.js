import { decorate, observable } from "mobx";

// import RNSimpleCompass from 'react-native-simple-compass';

export default class ArrowPageModel {
    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new ArrowPageModel();
        }
        return this.instance;
    }
    // const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
    setDestination(location) {
        if (location) {
            const degreeUpdateRate = 3;
            /*
            RNSimpleCompass.start(degreeUpdateRate, (degree) => {
                console.log('degree:' + degree);
            });
            */
        }
    }
    rotate = '270deg'
}
decorate(ArrowPageModel, {
    rotate: observable
});
