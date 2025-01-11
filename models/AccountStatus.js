
const mongoose = require('mongoose');


/* -------------------------------------------------------------------------- */
/*             FEW DEFAULT BIOS TO BEGIN WITH, LATER CAN BE EDITED            */
/* -------------------------------------------------------------------------- */

const defaultBios = [
    "New to this platform!",
    "Excited to connect with others.",
    "Sharing my thoughts and experiences.",
    "Looking forward to exploring this community.",
    "Keen to learn and grow.",
];

/* -------------------------------------------------------------------------- */
/*                ACCOUNT SCHEMA, ALL POSTS WILL BE LINKED HERE SOON               */
/* -------------------------------------------------------------------------- */


const AccountStatusSchema = mongoose.Schema({
    userId: {
        type: String, // Can be a custom string identifier
        unique: true, // Optional for uniqueness if needed
    },
    byOAuth : {
        type : Boolean,
        default:false,
    },
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxLength: [50, 'Name cannot exceed 50 characters'],
        set: (value) => {
            if (value) {
                return value
                    .toLowerCase()
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }
            return value;
        },
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: [true, 'Email already in use'],
        set: (value) => value.toLowerCase(),
        
    },
    bio: {
        type: String,
        default: () => defaultBios[Math.floor(Math.random() * defaultBios.length)],

        maxLength: [50, 'Bio cannot exceed 50 characters'],
        trim: true,
    },
    profilePicture: {
        type: String,
        default : "https://res.cloudinary.com/dddmjpmci/image/upload/v1735810332/hvdqqu7jzyod7brklvxc.png",
    },
    socialLinks: {
        type: Object,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    blogStats: {
        posts: { type: Number, default: 0 },
        followers: { type: Number, default: 0 },
        following: { type: Number, default: 0 },
    },
});
AccountStatusSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Email already in use'));
    } else {
        next(error);
    }
});
module.exports = mongoose.model('AccountStatus', AccountStatusSchema);