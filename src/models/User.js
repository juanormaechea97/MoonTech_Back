const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    rol: { type: String, required: true },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
