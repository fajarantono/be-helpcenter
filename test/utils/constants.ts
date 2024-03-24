import dotenv from 'dotenv';

dotenv.config();

export const APP_URL = `http://localhost:${process.env.APP_PORT}`;
export const TESTER_TOKEN = `${process.env.TOKEN}`;
