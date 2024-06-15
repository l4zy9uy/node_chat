const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true, minLength: 1, maxLength: 255},
    time: {type: String, required: true}
});

module.exports = mongoose.model("message_tests", MessageSchema);