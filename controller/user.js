import * as userRepository from '../data/user.js';
import {} from 'express-async-errors';
import bcrypt from 'bcrypt';
import { config } from '../config.js';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
	const { username, password, nickname } = req.body;
	console.log(req.body);
	console.log(password);
	console.log(config.bcrypt.saltRounds);
	const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);

	const userId = await userRepository.create({
		username,
		nickname,
		password: hashed,
	});
	console.log(userId);
	return res.status(201).json({ success: true, nickname });
}
export async function login(req, res) {
	const { username, password } = req.body;
	const user = await userRepository.findByUsername(username);

	if (!user) {
		return res
			.status(201)
			.json({ success: false, message: 'Invalid user or password' });
	}

	const isValidPassword = await bcrypt.compare(password, user.password);

	if (!isValidPassword) {
		return res
			.status(201)
			.json({ success: false, message: 'Invalid user or password' });
	}
	const token = createJwtToken(user.id);
	setToken(res, token);

	res.status(201).json({ success: true, token, username });
}

export async function getProfile(req, res) {
	const { username } = req.query;
	console.log(username);
	const user = await userRepository.findByUsername(username);

	res.status(200).json({ success: true, user });
}

export async function update(req, res) {
	const { username, password, newPassword } = req.body;
	console.log(req.body);
	const user = await userRepository.findByUsername(username);

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return res
			.status(200)
			.json({ success: false, message: 'Invalid user or password' });
	}

	const isSamePassword = await bcrypt.compare(newPassword, user.password);
	if (isSamePassword) {
		return res
			.status(200)
			.json({ success: false, message: 'Password is the same' });
	}

	const hashed = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
	user.password = hashed;
	res.status(200).json({ success: true, message: 'update success' });
}

export async function nickCheck(req, res) {
	const { nickname } = req.query;
	const user = await userRepository.findByNickname(nickname);
	if (!user) {
		return res.status(200).json({ success: true });
	}
	res.status(200).json({ success: false });
}

export async function userCheck(req, res) {
	const { username } = req.query;

	const user = await userRepository.findByUsername(username);
	if (!user) {
		return res.status(200).json({ success: true });
	}
	res.status(200).json({ success: false });
}

export async function logout(req, res) {
	res.cookies('token', '');
	res.status(200);
}

export async function remove(req, res) {
	console.log('시작');
	const id = req.query.id;
	console.log(id);

	const { password } = req.body;
	const user = await userRepository.findById(id);

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return res.status(401).json({ message: 'Invalid user or password' });
	}
	console.log('!!');

	const idx = await userRepository.findIdx(id);
	console.log('idx', idx);

	userRepository.removeUser(idx);

	res.status(204);
}

function createJwtToken(id) {
	console.log('key', config.jwt.secretKey);
	return jwt.sign({ id }, config.jwt.secretKey, {
		expiresIn: config.jwt.expiresInSec,
	});
}

export async function me(req, res) {
	const user = await userRepository.findById(req.userId);
	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}
	res.status(200).json({ token: req.token, username: user.username });
}

function setToken(res, token) {
	const options = {
		maxAge: config.jwt.expiresInSec * 1000,
		// httpOnly: true,
		// sameSite: 'none',
	};
	res.cookie('token', token, options);
}
