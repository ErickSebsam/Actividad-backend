const mysql = require ('mysql2/promise')


const dbConfig ={
    host: process.env.DB_HOST || 'localhost',
    user: process.env
}