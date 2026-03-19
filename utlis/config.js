require('dotenv').config()

const mongodb_url = process.env.mongodb_url
const port = process.env.port
const JWT_SECRET = process.env.JWT_SECRET
const AWS_Access_Key=process.env.AWS_Access_Key
const AWS_Secret_Key=process.env.AWS_Secret_Key
const AWS_Region=process.env.AWS_Region
const AWS_Bucket_Name=process.env.AWS_Bucket_Name
const localhost_backend_server_3001 = process.env.localhost_backend_server_3001
const localhost_frontend_server_5173 = process.env.localhost_frontend_server_5173
const localhost_frontend_server_5174 = process.env.localhost_frontend_server_5174

module.exports = {
    mongodb_url,
    port,
    JWT_SECRET,
    AWS_Access_Key,
    AWS_Secret_Key,
    AWS_Region,
    AWS_Bucket_Name,
    localhost_backend_server_3001,
    localhost_frontend_server_5173,
    localhost_frontend_server_5174
}