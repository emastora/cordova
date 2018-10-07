const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    local: {
        owner: String,
        brand: String,
        model: String,
        seats: String,
        color: String,
        licencePlate: String,
        year: String,
        cc: String,
        aircondition: String,
        petsAllowed: String
    }
}, { versionKey: false });

// create the model for vehicle and expose it to our app
module.exports = mongoose.model('Car', vehicleSchema);