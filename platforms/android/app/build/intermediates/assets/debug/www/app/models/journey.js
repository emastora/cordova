const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
    local: {
        requester: String,
        oid: Number,
        vehicle: Number,
        driver: String,
        mode: String,
        departureAddress: String,
        departureLat: Number,
        departureLng: Number,
        destinationAddress: String,
        destinationLat: Number,
        destinationLng: Number,
        schedule: Number,
        distance: Number,
        journeyDuration: Number,
        acceptedPassengers: Array,
        pendingPassengers: Array,
        rejectedPassengers: Array,
        waypoints: Array,
        seatsAvailable: Number,
        notes: String
    }
}, { versionKey: false });

// create the model for journey and expose it to our app
module.exports = mongoose.model('Journey', journeySchema);