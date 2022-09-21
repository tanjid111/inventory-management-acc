const mongoose = require("mongoose");

//schema design
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for this product."],
        trim: true, //removes blank space before and after
        unique: [true, "Name must be unique"],
        minLength: [3, "Name must be atleast 3 characters."],
        maxLength: [100, "Name is too large"]
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    unit: {
        type: String,
        required: true,
        enum: {
            values: ["kg", "liter", "pcs"],
            message: "unit value can't be {VALUE}, must be kg/liter/pcs"
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "quantity can't be negative"],
        validate: {
            validator: (value) => {
                const isInteger = Number.isInteger(value);
                if (isInteger) {
                    return true
                } else {
                    return false
                }
            }
        },
        message: "Quantity must be an integer"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["in-stock", "out-of-stock", "discontinued"],
            message: "status can't be {VALUE}"
        }
    },
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

productSchema.post('save', function (doc, next) {
    console.log('after saving data');

    next()
})

//------------instance method
productSchema.methods.logger = function () {
    console.log(`data saved for name ${this.name}`)
}

//SCHEMA -> MODEL -> QUERY

const Product = mongoose.model('Product', productSchema)

module.exports = Product;