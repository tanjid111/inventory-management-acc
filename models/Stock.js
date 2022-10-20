const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');

//schema design
const stockSchema = mongoose.Schema({
    productId: {
        type: ObjectId,
        required: true,
        ref: 'Product'
    },
    name: {
        type: String,
        required: [true, "Please provide a name for this product."],
        trim: true, //removes blank space before and after
        // unique: [true, "Name must be unique"],
        lowercase: true,
        minLength: [3, "Name must be atleast 3 characters."],
        maxLength: [100, "Name is too large"]
    },
    description: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
        enum: {
            values: ["kg", "liter", "pcs", "bag"],
            message: "unit value can't be {VALUE}, must be kg/liter/pcs/bag"
        }
    },

    imageURLs: [{
        type: String,
        required: true,
        validate: [validator.isURL, 'Please provide valid url(s)']
    }],

    price: {
        type: Number,
        required: true,
        min: [0, 'Product price cannot be negative'],
    },

    quantity: {
        type: Number,
        required: true,
        min: [0, 'Product quantity cannot be negative'],
    },

    category: {
        type: String,
        required: true
    },

    brand: {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: ObjectId,
            ref: 'Brand',
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['in-stock', 'out-of-stock', 'discontinued'],
            message: "Status cannot be {VALUE}"
        },
    },

    store: {
        name: {
            type: String,
            trim: true,
            required: [true, 'Please provide a store name'],
            lowercase: true,
            enum: {
                values: ['dhaka', 'chattogram', 'rajshahi', 'sylhet', 'khulna', 'barisal', 'rangpur', 'mymensingh'],
                message: "{VALUE} is not a valid name"
            }
        },
        id: {
            type: ObjectId,
            required: true,
            ref: 'Store'
        }
    },

    suppliedBy: {
        name: {
            type: String,
            trim: true,
            required: [true, 'Please provide a supplier name'],
        },
        id: {
            type: ObjectId,
            ref: 'Supplier'
        }
    },

    sellCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    //mongoose options
    timestamps: true,
})

//mongoose middleware for saving data: pre/post

stockSchema.pre('save', function (next) {
    console.log('before saving data');
    //replace product.quantity with this.quantity
    if (this.quantity == 0) {
        this.status = 'out-of-stock'
    }
    next()
})



const Stock = mongoose.model('Stock', stockSchema)

module.exports = Stock;