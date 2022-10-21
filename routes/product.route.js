const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const uploader = require('../middleware/uploader');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization')

// router.use(verifyToken) //to verify token for all the routes below.

//single file
// router.post('/file-upload', uploader.single('image'), productController.fileUpload);
// multiple file
router.post('/file-upload', uploader.array('image'), productController.fileUpload);

router.route('/bulk-update')
    .patch(productController.bulkUpdateProduct)

router.route('/bulk-delete')
    .delete(productController.bulkDeleteProduct)

router.route('/')
    .get(productController.getProducts)
    .post(verifyToken, authorization('admin', 'store-manager'), productController.createProduct)

router.route('/:id')
    .patch(productController.updateProductById)
    .delete(authorization('admin'), productController.deleteProductById)

module.exports = router;