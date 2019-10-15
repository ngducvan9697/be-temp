import {
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	UNAUTHORIZED
} from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userService from '../services/user.service';
import UserModule from '../models/user.model';
import { mainConfig } from '../config/main.config';

export default {
	async signup(req, res) {
		try {
			const { error, value } = userService.validateSchemaSignup(req.body);
			if (error && error.details) {
				return res.status(BAD_REQUEST).json(error);
			}
			const existingUser = await UserModule.findOne({ 'local.email': value.email });
			if (existingUser) {
				return res.status(BAD_REQUEST).json({ err: 'You have already created account' });
			  }
			  console.log(value);
			  
			  const user = await new UserModule();
			  user.local.email = value.email;
			  const salt = await bcryptjs.genSalt();
			  const hash = await bcryptjs.hash(value.password, salt);
			  user.local.password = hash;

			await UserModule.create(value);
			return res.json({ success: true, message: 'User created successfully' });
		} catch (err) {
			console.error(err);
			return res.status(INTERNAL_SERVER_ERROR).json(err);
		}
	},
	async login(req, res) {
		try {
			const { error, value } = userService.validateSchemaLogin(req.body);
			
			if (error && error.details) {
				return res.status(BAD_REQUEST).json(error);
			}
			
			const user = await UserModule.findOne({ email: value.email });
			if (!user) {
				return res
					.status(BAD_REQUEST)
					.json({ err: 'invalid email or password' });
			}
			const matched = await bcryptjs.compare(value.password, user.password);
			if (!matched) {
				return res.status(UNAUTHORIZED).json({ err: 'invalid credentials' });
			}
			const token = jwt.sign({ id: user._id }, mainConfig.secret, {
				expiresIn: '1d'
			});
			return res.json({ success: true, token });
		} catch (err) {
			console.error(err);
			return res.status(INTERNAL_SERVER_ERROR).json(err);
		}
	},
	async test(req, res) {
		return res.json(req.currentUser);
	}
};