import dotenv from 'dotenv'
dotenv.config()

interface Config {
  mongodb_url: string;
  port: number;
  JWT_SECRET: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_Bucket_Name01: string;
  AWS_Bucket_Name02: string;
  localhost_backend_server_3001: string;
  localhost_frontend_server_5173: string;
  localhost_frontend_server_5174: string;
  localhost_frontend_server_5175: string;
  publicIP: string;
  elasticIp: string;
  production_frontend_website: string;
  production_backend: string;
  dev_backend: string;
  production_port: number;
  uat_backend: string;
  uat_port: number;
}

// Parse env variables and provide defaults if needed
const config: Config = {
  mongodb_url: process.env.mongodb_url || "",
  port: process.env.port ? Number(process.env.port) : 3001,
  uat_port: process.env.uat_port ? Number(process.env.uat_port) : 3002,
  production_port: process.env.production_port ? Number(process.env.production_port) : 5000,
  JWT_SECRET: process.env.JWT_SECRET || "",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_Bucket_Name01: process.env.AWS_Bucket_Name01 || "",
  AWS_Bucket_Name02: process.env.AWS_Bucket_Name02 || "",
  localhost_backend_server_3001: process.env.localhost_backend_server_3001 || "",
  localhost_frontend_server_5173: process.env.localhost_frontend_server_5173 || "",
  localhost_frontend_server_5174: process.env.localhost_frontend_server_5174 || "",
  localhost_frontend_server_5175: process.env.localhost_frontend_server_5175 || "",
  publicIP: process.env.publicIP || "",
  elasticIp: process.env.elasticIp || "",
  production_frontend_website: process.env.production_frontend_website || "",
  production_backend: process.env.production_backend || "",
  uat_backend: process.env.uat_backend || "",
  dev_backend: process.env.dev_backend || ""
};

export default config;