const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupMemberSchema = new Schema({
    contact_id: {type: Schema.Types.ObjectId, ref: "contact", required: true},
    conversation_id: {type: Schema.Types.ObjectId, ref: "conversation", required: true},
    joined_datetime: {type: Date},
    left_datetime: {type: Date, require: true}
});

module.exports = mongoose.model("group_member", GroupMemberSchema);