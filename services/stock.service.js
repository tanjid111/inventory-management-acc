const Stock = require('../models/Stock')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

exports.getStocksService = async (filters, queries) => {
    // const stocks = await Stock
    //     .find(filters)
    //     .select(queries.fields)
    //     .sort(queries.sortBy)
    //     .skip(queries.skip)
    //     .limit(queries.limit)

    const stocks = await Stock.aggregate([
        // { $match: { 'store.name': 'chattogram' } }
        // { $match: { 'store.name': 'chattogram' } }
        { $match: {} },
        {
            $project: {
                store: 1,
                price: { $convert: { input: '$price', to: 'int' } },
                quantity: 1
            }
        },
        { $group: { _id: '$store.name', totalProductsPrice: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ])

    const total = await Stock.countDocuments(filters);
    const page = Math.ceil(total / queries.limit);
    return { total, page, stocks };

}

exports.getStockByIdService = async (id) => {
    // const stock = await Stock.find({ _id: id })
    // .populate('store.id')
    // .populate('suppliedBy.id')
    // .populate('brand.id')

    //pipe line -> many stages
    //data -> one stage -> two stage

    //          name, age, contactNo -> contactNo

    const stock = await Stock.aggregate([
        //stage1
        { $match: { _id: ObjectId(id) } },
        {
            $project: {
                category: 1,
                quantity: 1,
                price: 1,
                productId: 1,
                name: 1,
                'brand.name': { $toLower: $brand.name }
            }
        },
        {
            $lookup: {
                from: 'brands',
                localField: 'brand.name',
                foreignField: 'name',
                as: 'brandDetails'
            }
        }

    ])

    return stock;
}

exports.createStockService = async (data) => {
    const stock = await Stock.create(data);

    return stock;
}

exports.updateStockByIdService = async (stockId, data) => {
    //------------------method 1 validate by RANVALIDATORS
    // const result = await Product.updateOne({ _id: productId }, { $set: data }, { runValidators: true }); //to validate 

    //------------------method 2 validate by saving
    // const product = await Product.findById(productId);
    // const result = await product.set(data).save();


    //FIND BY ID AND UPDATE // FIND ONE AND UPDATE ARE IDENTICAL, CHECK DOCUMENTATION

    // -----------TO INCREASE BY 3
    const result = await Stock.updateOne({ _id: productId }, { $inc: data }, { runValidators: true });
    return result;
}

exports.bulkUpdateStockService = async (data) => {
    //-----this is for updating one price for all product ids
    // const result = await Product.updateMany({ _id: data.ids }, data.data, { runValidators: true });

    const stocks = []
    data.ids.forEach(stock => {
        stocks.push(Stock.updateOne({ _id: stock.id }, stock.data))
    })
    const result = await Promise.all(stocks);
    return result;
}

exports.deleteStockByIdService = async (id) => {
    const result = await Stock.deleteOne({ _id: id })
    return result;
}

exports.bulkDeleteStockService = async (ids) => {
    const result = await Stock.deleteMany({ _id: ids })
    //to delete all ids
    // const result = await Product.deleteMany({})
    return result;
}

