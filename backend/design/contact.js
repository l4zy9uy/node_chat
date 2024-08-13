const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    first_name: { type: String, required: true, minLength: 1, maxLength: 255 },
    last_name: { type: String, required: true, minLength: 1, maxLength: 255 },
    profile_photo: { type: String }, // URL to the stored image
    phone_number: { type: String, required: true, match: [/^\+[1-9]{1}[0-9]{3,14}$/, "Please fill a valid phone number"] },
    status_message: { type: String, maxLength: 255 }
}, { timestamps: true });

module.exports = mongoose.model("Contact", ContactSchema);
