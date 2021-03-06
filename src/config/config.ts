import dotenv from 'dotenv';
dotenv.config();

export default {
  APP: process.env.APP || 'development',
  PORT: process.env.PORT || '3001',

  DB_HOST: process.env.DB_HOST || 'mongodb://localhost:27017/example_db',

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || 'jwt_please_change',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '30d',
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
}