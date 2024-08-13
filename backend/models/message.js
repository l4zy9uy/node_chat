const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    from_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message_text: { type: String, required: true, minLength: 1, maxLength: 255 },
    conversation_id: { type: Schema.Types.ObjectId, required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
