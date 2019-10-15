import express from 'express';
import passport from 'passport';
import userController from '../controllers/user.controller';

export const userRouter = express.Router();
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.post('/test', passport.authenticate('jwt', { session: false }), userController.test);

// invoiceRouter
//   .route('/:id')
//   .put(passport.authenticate('jwt', { session: false }), invoiceController.update)
//   .delete(passport.authenticate('jwt', { session: false }), invoiceController.delete)
//   .get(passport.authenticate('jwt', { session: false }), invoiceController.findOne);