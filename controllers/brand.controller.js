const { createBrandService, getBrandsService, getBrandByIdService, updateBrandService } = require("../services/brand.service")

exports.createBrand = async (req, res, next) => {
    try {
        const result = await createBrandService(req.body);
        res.status(200).json({
            status: 'success',
            message: 'successfully created the brand'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: 'Could not create the brand'
        })
    }
}

exports.getBrands = async (req, res, next) => {
    try {
        const brands = await getBrandsService();
        res.status(200).json({
            status: 'success',
            data: brands
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: 'Could not get the brands'
        })
    }
}

exports.getBrandById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const brand = await getBrandByIdService(id);

        if (!brand) {
            return res.status(400).json({
                status: 'fail',
                error: 'Could not find a brand with this id'
            })
        }

        res.status(200).json({
            status: 'success',
            data: brand
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: 'Could not get the brand'
        })
    }
}

exports.updateBrand = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await updateBrandService(id, req.body);

        if (!result.nModified) {
            return res.status(400).json({
                status: 'fail',
                error: 'Could not update the brand with this id'
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Successfully updated the brand'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: 'Could not update the brand'
        })
    }
}