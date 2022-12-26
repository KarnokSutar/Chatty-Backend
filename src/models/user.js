const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        // unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        validate: {
            validator: async function (v) {
                const usr = await User.findOne({ email: v }).exec();
                console.log(usr)
                if (usr) {
                    return false;
                }
            },
            message: props => `${props.value} is already Taken`
        }

    },
    hash: {
        type: String
    },
    salt: {
        type: String
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User