const Product = require('../models/Product')

exports.getProductsService = async (filters, queries) => {
    const products = await Product
        .find(filters)
        .select(queries.fields)
        .sort(queries.sortBy);
    return products;
}

exports.createProductService = async (data) => {
    const product = await Product.create(data)
    return product;
}

exports.updateProductByIdService = async (productId, data) => {
    //------------------method 1 validate by RANVALIDATORS
    // const result = await Product.updateOne({ _id: productId }, { $set: data }, { runValidators: true }); //to validate 

    //------------------method 2 validate by saving
    // const product = await Product.findById(productId);
    // const result = await product.set(data).save();


    //FIND BY ID AND UPDATE // FIND ONE AND UPDATE ARE IDENTICAL, CHECK DOCUMENTATION

    // -----------TO INCREASE BY 3
    const result = await Product.updateOne({ _id: productId }, { $inc: data }, { runValidators: true });
    return result;
}

exports.bulkUpdateProductService = async (data) => {
    //-----this is for updating one price for all product ids
    // const result = await Product.updateMany({ _id: data.ids }, data.data, { runValidators: true });

    const products = []
    data.ids.forEach(product => {
        products.push(Product.updateOne({ _id: product.id }, product.data))
    })
    const result = Promise.all(products);
    return result;
}

exports.deleteProductByIdService = async (id) => {
    const result = await Product.deleteOne({ _id: id })
    return result;
}

exports.bulkDeleteProductService = async (ids) => {
    const result = await Product.deleteMany({ _id: ids })
    //to delete all ids
    // const result = await Product.deleteMany({})
    return result;
}

