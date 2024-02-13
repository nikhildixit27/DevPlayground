const mongoose = require('mongoose');

const codeSchema = mongoose.Schema(
    {
        html: {
            type: String,
            required: true,
        },
        css: {
            type: String,
            required: true,
        },
        js: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Code', codeSchema);
