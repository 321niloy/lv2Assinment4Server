import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { ProductServices } from './Products.service';

import SSLCommerzPayment from 'sslcommerz-lts';
import { v4 as uuidv4 } from 'uuid';

const createProducts = async (req: Request, res: Response) => {
  try {
    const result = await ProductServices.createProductsIntoDB(req.body);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Products created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Products Failed to create course',
      error: error.message,
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await ProductServices.getAllProducts(req.query);

    if (!allProducts) {
      // If no products are found, respond with 404
      return res.status(404).json({
        success: false,
        message: 'Products Not Found',
      });
    }

    // Respond with the products fetched successfully
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Products fetched successfully',
      data: allProducts,
    });
  } catch (error: any) {
    // Handle errors from ProductServices or other potential errors
    console.error('Error fetching products:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong while fetching products',
      error: error.message,
    });
  }
};

const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const Product = await ProductServices.getProduct(id);
    if (!Product) {
      res.status(404).json({
        success: false,
        message: 'Product Not Found',
      });
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product get successfully',
      data: Product,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something whent Wrong for Fetching singel Product',
      error: error.message,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const DeleteProduct = await ProductServices.deleteProduct(id);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product delated successfully',
      data: DeleteProduct,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something whent Wrong for Delating singel Product',
      error: error.message,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const UpdatedProduct = await ProductServices.updateProduct(id, payload);
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Product Updated successfully',
      data: UpdatedProduct,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Somthing whent Wrong in Updated Operation',
      error: error.message,
    });
  }
};

const latestProduct = async (req: Request, res: Response) => {
  try {
    const latestProducts = await ProductServices.getAllLatestProducts();
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Latest Products get successfully',
      data: latestProducts,
    });
  } catch (error: any) {
    console.log('fatlaerroR', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something whent Wrong for Fetching',
      error: error.message,
    });
  }
};

const productCarts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cartProducts = await ProductServices.createProductsCartIntoDB(id);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Cart Products added successfully',
      data: cartProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllCartsProducts = async (req: Request, res: Response) => {
  try {
    const getCartProducts = await ProductServices.getAllCartsProducts();

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Cart Products added successfully',
      data: getCartProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

// const getPayment = async (req: Request, res: Response) => {
//   try {
//     const getPayment = await ProductServices.getPayment;
//   } catch (error) {
//     console.log(error);
//   }
// };

const getPayment = async (req: Request, res: Response) => {
  let payload = req.body;
  const tran_id = uuidv4();
  let singelId;
  let totalProductAmount;
  let allcartItems;

  // console.log('genarated new id', tran_id);
  try {
    if (!payload.state) {
      singelId = payload.product._id;
      totalProductAmount = payload.totalAmount;
      // console.log(singelId, totalProductAmount);
    } else if (payload.state) {
      const cartitemsData = JSON.stringify(payload, null, 2);
      const parseCartitemsData = JSON.parse(cartitemsData);
      allcartItems = parseCartitemsData.state.cartItems;
      totalProductAmount = parseCartitemsData.state.totalAmount;
      // console.log(allcartItems, totalProductAmount);
    }

    const successUrl = new URL(
      `http://localhost:5010/api/v1/sports/payment/success/${tran_id}`,
    );
    successUrl.searchParams.append('payload', payload);

    const data = {
      total_amount: totalProductAmount,
      currency: 'BDT',
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: successUrl.toString(),
      fail_url: 'http://localhost:3030/fail',
      cancel_url: 'http://localhost:3030/cancel',
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: 'Sports Related',
      product_category: 'Sports Related',
      product_profile: 'general',
      cus_name: 'Customer Name',
      cus_email: 'customer@example.com',
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };

    // Initialize payment
    const sslcz = new SSLCommerzPayment(
      'sport6691f42c2db9b',
      'sport6691f42c2db9b@ssl',
      false,
    );
    sslcz.init(data).then(apiResponse => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      // res.json({ url: GatewayPageURL });
      res.send({ url: GatewayPageURL });
    });
  } catch (error) {
    console.log(error);
  }
};

const afterPaymentSuccess = async (req: Request, res: Response) => {
  try {
    console.log('AfterPayment', req.params.tran_id);
    console.log('AfterPayment payload:', JSON.stringify(req.body));
  } catch (error) {
    console.log(error);
  }
};

export const ProductControllers = {
  createProducts,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  latestProduct,
  productCarts,
  getAllCartsProducts,
  getPayment,
  afterPaymentSuccess,
};
