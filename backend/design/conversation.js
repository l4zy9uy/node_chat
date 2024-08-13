const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    conversationName: { type: String },
    messageIds: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    type: { type: String, enum: ['personal', 'group'], default: 'personal' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
