/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/route';
import bodyParser from 'body-parser';
// const express = require('express');

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*' }));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('How are you');
});

//application routes
app.use('/api/v1', router);

export default app;
