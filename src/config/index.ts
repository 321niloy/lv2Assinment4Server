import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  store_id: process.env.STORE_ID,
  store_password: process.env.STORE_PASSWORD,
  is_live: process.env.IS_LIVE,
};
