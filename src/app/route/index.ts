import express from 'express';
import { ProductsRoutes } from '../Modules/Products/Products.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/sports',
    route: ProductsRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

// router.use('/users', userRoutes);
// router.use('/students', studentRoute);

export default router;
