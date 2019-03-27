
export default class PlacePageModel {

    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new PlacePageModel();
        }
        return this.instance;
    }

    place;
}
