const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    user_info: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        required: true
    },
    reason_info: {
        ban: {
            type: String,
            required: true
        },
        appeal: {
            type: String,
            required: true
        },
        required: true
    }
});
module.exports = mongoose.model("appeal", schema);