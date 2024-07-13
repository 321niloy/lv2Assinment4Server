import express from 'express';
import { ProductControllers } from './Products.controller';
const router = express.Router();

router.post('/create-products', ProductControllers.createProducts);
router.get('/products', ProductControllers.getAllProducts);
router.get('/products/:id', ProductControllers.getProduct);
router.delete('/products/:id', ProductControllers.deleteProduct);
router.put('/products/:id', ProductControllers.updateProduct);
router.get('/latest', ProductControllers.latestProduct);
router.post(`/productsCart/:id`, ProductControllers.productCarts);
router.get('/carts', ProductControllers.getAllCartsProducts);
router.post('/payment', ProductControllers.getPayment);
router.post(
  '/payment/success/:tran_id',
  ProductControllers.afterPaymentSuccess,
);
export const ProductsRoutes = router;
