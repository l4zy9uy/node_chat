const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true, minLength: 1, maxLength: 255},
    time: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Message", MessageSchema);