const mongoose = require('mongoose')

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    chat: {
        type: Array
    },
    members: [{type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true}]}, { timestamps: true });

    const Group = mongoose.model('Group', GroupSchema);

    module.exports = Group;

    