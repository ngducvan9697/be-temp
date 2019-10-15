import express from 'express';
import { userRouter } from './user.router';
import { authRouter } from './auth.router';

export const mainRouter = express.Router();
mainRouter.use('/users', userRouter);
mainRouter.use('/auth', authRouter);