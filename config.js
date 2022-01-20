import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
	const value = process.env[key] || defaultValue;
	if (!!!value) {
		throw new Error(`key ${key} is undefined`);
	}
	return value;
}

export const config = {
	jwt: {
		secretKey: required('JWT_SECRET'),
		expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
	},
	bcrypt: {
		saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
	},
};
