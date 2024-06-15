const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {type: String, required: true, minlength: 6, maxlength: 32},
    password: {type: String, required: true},
    name: {type: String, required: true, minLength: 1, maxLength: 64}
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

module.exports = mongoose.model("User", UserSchema);