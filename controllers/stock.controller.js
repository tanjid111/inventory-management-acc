const { getStocksService, createStockService, updateStockByIdService, bulkUpdateStockService, deleteStockByIdService, bulkDeleteStockService, getStockByIdService } = require('../services/stock.service');

exports.getStocks = async (req, res, next) => {
    try {
        //price:{$gt:50}
        let filters = { ...req.query };
        // /stock?sortBy=price

        //--------------sort, page, limit -> exclude
        const excludeFields = ['sort', 'page', 'limit'];
        excludeFields.forEach(field => delete filters[field])


        //gt, lt, gte, lte

        let filtersString = JSON.stringify(filters);
        filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        filters = JSON.parse(filtersString);

        const queries = {}; //empty object which will include data from sort

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            queries.sortBy = sortBy;
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            queries.fields = fields;
        }

        if (req.query.page) {
            const { page = 1, limit = 10 } = req.query

            //50 products
            //each page 10 product
            //page 1--> 1 - 10
            //page 2--> 11 - 20
            //page 3--> 21 - 30 --> page 3 --> skip 1 - 20
            //page 4--> 31 - 40 --> page 4 --> skip 1 - 30
            //page 5--> 41 - 50
            //req.query returns string value. to converrt limit to number it can be multiplied with 1 or parseInt or Nunber
            const skip = (page - 1) * parseInt(limit)
            // const skip = (page - 1) * {limit*1}
            queries.skip = skip;
            queries.limit = parseInt(limit);
        }
        // console.log('original object', req.query);
        // console.log('query object', filters);
        const products = await getStocksService(filters, queries); //get all products

        // const products = await Product.find({ _id: "632024b264457e80c047e25e" }); //get by single id
        //const products = await Product.find({ _id: "632024b264457e80c047e25e", name: "dal" }); //get by single id and name, and operator
        //const products = await Product.find({ $or: [{ _id: "632024b264457e80c047e25e" }, { name: "asdasdads" }] }); //get by single id or name, or operator
        //const products = await Product.find({ status: { $ne: "out-of-stock" } }); // not equal to 
        //const products = await Product.find({ quantity: { $gt: 100 } }); // greater than gt, greater than or equal gte
        //const products = await Product.find({ name: { $in: ["Chal", "dal"] } });//in operator
        //const products = await Product.find({}, 'name quantity'); //projection show name and quantity
        //const products = await Product.find({}, '-name -quantity'); //projection show everything except name and quantity
        // const products = await Product.find({}).select({ name: 1 }); //select method for projection by mongoose
        //const products = await Product.find({}).limit(2); //limit to 2
        //const products = await Product.find({}).sort({ quantity: -1 }) //descending order

        //mongoose gave query builder - since its a sequence it is easier and makes it readible
        //const products = await Product.where("name").equals("Chal").where("quantity").gt(100)
        // const products = await Product
        // .where("name").equals(/\w/)
        // .where("quantity").gt(100).lt(600)
        // .limit(2).sort({ quantity: -1 }) //any name but quantity greater than 100

        // const products = await Product.findById("63201e8d56296897b8f4353d")

        res.status(200).json({
            status: 'success',
            data: products
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Cannot get the data',
            error: error.message
        })
    }
}

exports.getStockById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const stock = await getStockByIdService(id)
        if (!stock) {
            res.status(400).json({
                status: 'fail',
                error: 'Cannot get the stock with this id',
            })
        }

        res.status(200).json({
            status: 'success',
            data: stock
        })

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Cannot get the stock',
            error: error.message
        })
    }
}

exports.createStock = async (req, res, next) => {

    try {
        //save or create

        const result = await createStockService(req.body);

        res.status(200).json({
            status: 'success',
            message: 'Stock created successfully!',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Stock is not inserted',
            error: error.message
        })
    }
}

exports.updateStockById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateStockByIdService(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Stock updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't update the stock",
            error: error.message
        })
    }
}

exports.bulkUpdateStock = async (req, res, next) => {
    try {
        const result = await bulkUpdateStockService(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Stock updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't update the stock",
            error: error.message
        })
    }
}

exports.deleteStockById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteStockByIdService(id);

        //--------------do this for checking if the stock exist. Do same for update
        if (!result.deletedCount) {
            return res.status(400).json({
                status: "fail",
                error: "Could not delete the stock"
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Stock deleted successfully!'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't delete the stock",
            error: error.message
        })
    }
}

exports.bulkDeleteStock = async (req, res, next) => {
    try {
        const result = await bulkDeleteStockService(req.body.ids);
        res.status(200).json({
            status: 'success',
            message: 'Given stocks deleted successfully'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't delete the given stocks",
            error: error.message
        })
    }
}
