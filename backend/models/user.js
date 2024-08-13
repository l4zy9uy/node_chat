const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: { type: String, required: true, minlength: 6, maxlength: 32 },
    email: { type: String, required: true, unique: true, index: true },
    lastLoginAt: { type: Date },
    password: { type: String, required: true },
    first_name: { type: String, required: true, minLength: 1, maxLength: 255 },
    last_name: { type: String, required: true, minLength: 1, maxLength: 255 },
    profile_photo: { type: Buffer },
    phone_number: { type: String, required: true, match: [/^\+[1-9]{1}[0-9]{3,14}$/, "Please fill a valid phone number"] }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

module.exports = mongoose.model("User", UserSchema);
