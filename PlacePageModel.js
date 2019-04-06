import { decorate, observable } from "mobx";
import Utils from './Utils';

export default class PlacePageModel {

    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new PlacePageModel();
        }
        return this.instance;
    }

    place;
    setPlace(place) {
        if (place !== this.place) {
            // create url
            if (place.details.photos) {
                place.details.photos.forEach(photo => {
                    photo.url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photo.width}&photoreference=${photo.photo_reference}&key=${Utils.getInstance().key}`;
                });
            }

            this.place = place;
        }
    }

    // openingHours        should be local mobx state handling
    showClockIcon = false;
}
decorate(PlacePageModel, {
    showClockIcon: observable
});
