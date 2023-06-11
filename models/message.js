const {Schema, model} = require('mongoose');

const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;

const messageSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        unique: true,
        required: [true, 'Enter first and last name'],
        match: [nameRegex, 'First name and last name must be capitalized'],
    },
    text: {
        type: String,
        maxlength: 300,
        required: [true, 'Enter message'],
    },
},
{versionKey: false, timestamps: true}
);

const Message = model('message', messageSchema);

module.exports = Message;

