import QueryBuilder from '../../builder/QuieryBuilder';
import { ProductsSearchableFields } from './Product.constant';
import { Tproducts } from './Products.interface';
import { Cart, Product } from './Products.model';
import { v4 as uuidv4 } from 'uuid';
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../../config';
import { Request, Response } from 'express';

const createProductsIntoDB = async (payload: Tproducts) => {
  try {
    const NewProducts = await Product.create(payload);
    if (!NewProducts) {
      throw new Error('Failed to create Products');
    }
    return NewProducts;
  } catch (error) {
    throw new Error('SomeThing went Wrong in Products Created Service');
  }
};

const getAllProducts = async (query: Record<string, unknown>) => {
  try {
    console.log('request query for get all Products', query);
    const ProductQuery = new QueryBuilder(Product.find(), query)
      .search(ProductsSearchableFields)
      .filter()
      .sort()
      .pagination()
      .fields();

    const result = await ProductQuery.Modelquery;
    return result;
  } catch (error) {
    console.log('some error', error);
  }
};

const getProduct = async (id: string) => {
  try {
    const singelProduct = await Product.findOne({ _id: id });
    if (!singelProduct) {
      throw new Error('SingelProdct Not Found');
    }
    return singelProduct;
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (id: string) => {
  try {
    const DelatedProduct = await Product.updateOne(
      { _id: id },
      {
        isDeleted: true,
      },
    );
    if (!DelatedProduct) {
      throw new Error('Not delated');
    }
    return DelatedProduct;
  } catch (error) {
    throw new Error('Something went Wrong from Delating');
  }
};

const updateProduct = async (id: string, payload: Tproducts) => {
  try {
    const result = await Product.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      throw new Error('Updated Not Successfull');
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getAllLatestProducts = async () => {
  try {
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10);
    if (!latestProducts) {
      console.log('kamavinga');
    }
    return latestProducts;
  } catch (error) {
    console.log('lala', error);
  }
};

const createProductsCartIntoDB = async (id: string) => {
  try {
    const singelProduct = await Product.findOne({ _id: id });

    if (!singelProduct) {
      throw new Error('Single Product Not Found');
    }

    const cartProduct = {
      name: singelProduct.name,
      category: singelProduct.category,
      description: singelProduct.description,
      price: singelProduct.price,
      brand: singelProduct.brand,
      rating: singelProduct.rating,
      image: singelProduct.image,
      quantity: singelProduct.quantity,
    };

    const createdCartProduct = await Cart.create(cartProduct);
    return createdCartProduct;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error;
  }
};

const getAllCartsProducts = async () => {
  try {
    const allCartsProduct = await Cart.find();
    return allCartsProduct;
  } catch (error) {
    console.log('Error from Get All Cart', error);
  }
};

// ///////+++++++++++++============================

export const ProductServices = {
  createProductsIntoDB,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getAllLatestProducts,
  createProductsCartIntoDB,
  getAllCartsProducts,
};
