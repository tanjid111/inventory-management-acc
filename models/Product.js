const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');

//schema design
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for this product."],
        trim: true, //removes blank space before and after
        unique: [true, "Name must be unique"],
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
        validate: {
            validator: (value) => {
                if (!Array.isArray(value)) {
                    return false;
                }
                let isValid = true;
                value.forEach(url => {
                    if (!validator.isURL(url)) {
                        isValid = false;
                    }
                });
                return isValid;
            },
            message: 'Please provide valid image URLs'
        }
    }],

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
    }

    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt:{
    //   type: Date,
    //   default: Date.now,
    // }
    // supplier: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Suppplier"
    // },
    // categories: [{
    //   name: {
    //     type: String,
    //     required: true
    //   },
    //   _id: mongoose.Schema.Types.ObjectId,
    // }]
}, {
    //mongoose options
    timestamps: true,
})

//mongoose middleware for saving data: pre/post

productSchema.pre('save', function (next) {
    console.log('before saving data');
    //replace product.quantity with this.quantity
    if (this.quantity == 0) {
        this.status = 'out-of-stock'
    }
    next()
})

// productSchema.post('save', function (doc, next) {
//     console.log('after saving data');

//     next()
// })

//------------instance method
// productSchema.methods.logger = function () {
//     console.log(`data saved for name ${this.name}`)
// }

//SCHEMA -> MODEL -> QUERY

const Product = mongoose.model('Product', productSchema)

module.exports = Product;