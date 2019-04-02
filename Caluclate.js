export default class Calculate {
    // Converts from degrees to radians.
    static toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    // Converts from radians to degrees.
    static toDegrees(radians) {
        return radians * 180 / Math.PI;
    }


    static bearing(startLat, startLng, destLat, destLng) {
        startLat = this.toRadians(startLat);
        startLng = this.toRadians(startLng);
        destLat = this.toRadians(destLat);
        destLng = this.toRadians(destLng);

        const y = Math.sin(destLng - startLng) * Math.cos(destLat);
        const x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        let brng = Math.atan2(y, x);
        brng = this.toDegrees(brng);
        return (brng + 360) % 360;
    }
    static distance(lat1, lng1, lat2, lng2) {
        const earthRadius = 6371000;
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const  c = 2* Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = (earthRadius * c);
        return dist
      }
}