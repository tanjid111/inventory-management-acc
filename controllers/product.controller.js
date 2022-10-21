const Product = require('../models/Product');
const { getProductsService, createProductService, updateProductByIdService, bulkUpdateProductService, deleteProductByIdService, bulkDeleteProductService } = require('../services/product.service');

exports.getProducts = async (req, res, next) => {
    try {
        //price:{$gt:50}
        let filters = { ...req.query };

        //sort , page , limit -> exclude
        const excludeFields = ['sort', 'page', 'limit']
        excludeFields.forEach(field => delete filters[field])

        //gt ,lt ,gte .lte
        let filtersString = JSON.stringify(filters)
        filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        filters = JSON.parse(filtersString)

        const queries = {}

        if (req.query.sort) {
            // price,qunatity   -> 'price quantity'
            const sortBy = req.query.sort.split(',').join(' ')
            queries.sortBy = sortBy
            console.log(sortBy);
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            queries.fields = fields
            // console.log(fields);
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
        const products = await getProductsService(filters, queries); //get all products

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

exports.createProduct = async (req, res, next) => {

    try {
        //save or create

        //--------------save
        // const product = new Product(req.body)
        // instance creation -> do something ->save()
        // if (product.quantity == 0) {
        //   product.status = 'out-of-stock'
        // }
        // const result = await product.save()

        //-----------calling instance method

        // result.logger()
        //-------------create
        const result = await createProductService(req.body);

        res.status(200).json({
            status: 'success',
            message: 'Data inserted successfully!',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Data is not inserted',
            error: error.message
        })
    }
}

exports.updateProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await updateProductByIdService(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't update the product",
            error: error.message
        })
    }
}

exports.bulkUpdateProduct = async (req, res, next) => {
    try {
        const result = await bulkUpdateProductService(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Data updated successfully!'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't update the product",
            error: error.message
        })
    }
}

exports.deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteProductByIdService(id);

        //--------------do this for checking if the product exist. Do same for update
        if (!result.deletedCount) {
            return res.status(400).json({
                status: "fail",
                error: "Could not delete the product"
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Data deleted successfully!'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't delete the product",
            error: error.message
        })
    }
}

exports.bulkDeleteProduct = async (req, res, next) => {
    try {
        const result = await bulkDeleteProductService(req.body.ids);
        res.status(200).json({
            status: 'success',
            message: 'Given products deleted successfully'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Couldn't delete the given products",
            error: error.message
        })
    }
}

exports.fileUpload = async (req, res) => {
    try {
        //single file
        // res.status(200).json(req.file)
        //multiple files
        res.status(200).json(req.files)
    } catch (error) {

    }
}