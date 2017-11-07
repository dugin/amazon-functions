const admin = require("firebase-admin");
const serviceAccount = require("./../firebase-adminsdk.json");

const moment = require('moment');

class Firebase {

    constructor() {
        this.FLIGHTS = 'flights';
        this.PRICES = 'prices';
        this.LOGS = 'logs';
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://listado-35e6c.firebaseio.com"
        });
        this.db = admin.firestore();
    }

    _snapshotToArray(snapshot) {
        const arr = [];

        snapshot.forEach(doc => {
            arr.push({id: doc.id, data: doc.data()});
        });

        return arr;
    }

    getFlights() {
        return this.db.collection(this.FLIGHTS)
            .get()
            .then(snapshot => this._snapshotToArray(snapshot))
    }

    getFlight(id) {
        return this.db.collection(this.FLIGHTS).doc(id).collection(this.FLIGHTS)
            .get()
            .then(snapshot => this._snapshotToArray(snapshot))
    }

    updateFlightsPrice(userID, flightID, minPrice, price) {
        return this.db.collection(this.FLIGHTS)
            .doc(userID)
            .collection(this.FLIGHTS)
            .doc(flightID)
            .update({
                price: minPrice,
                updatedAt: moment().toDate()
            })
            .then(() => this._updatePriceLogsRef(userID, flightID, price))
            .then(() => price)
    }

    _updatePriceLogsRef(userID, flightID, price) {
        return this.db.collection(this.FLIGHTS)
            .doc(userID)
            .collection(this.PRICES)
            .doc(flightID)
            .collection(this.LOGS)
            .add({price, createdAt: moment().toDate()})
    }
}

module.exports = Firebase;