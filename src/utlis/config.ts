import dotenv from 'dotenv'
dotenv.config()

interface Config {
  mongodb_url: string;
  port: number;
  JWT_SECRET: string;
  AWS_Access_Key: string;
  AWS_Secret_Key: string;
  AWS_Region: string;
  AWS_Bucket_Name: string;
  localhost_backend_server_3001: string;
  localhost_frontend_server_5173: string;
  localhost_frontend_server_5174: string;
  localhost_frontend_server_5175: string;
}

// Parse env variables and provide defaults if needed
const config: Config = {
  mongodb_url: process.env.mongodb_url || "",
  port: process.env.port ? Number(process.env.port) : 5000,
  JWT_SECRET: process.env.JWT_SECRET || "",
  AWS_Access_Key: process.env.AWS_Access_Key || "",
  AWS_Secret_Key: process.env.AWS_Secret_Key || "",
  AWS_Region: process.env.AWS_Region || "",
  AWS_Bucket_Name: process.env.AWS_Bucket_Name || "",
  localhost_backend_server_3001: process.env.localhost_backend_server_3001 || "",
  localhost_frontend_server_5173: process.env.localhost_frontend_server_5173 || "",
  localhost_frontend_server_5174: process.env.localhost_frontend_server_5174 || "",
  localhost_frontend_server_5175: process.env.localhost_frontend_server_5175 || "",
};

export default config;