import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();


const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
})

export function connectToDatabase() {
    connection.connect((err) => {
        if(err) throw err;
        
        //create database
        let db_sql = `
        CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}
        `
        connection.query(db_sql, (err) => {
            if(err) throw err;
            console.log(`${process.env.DATABASE_NAME} database connected`)
        })

        //use database
        let use_sql = `
        USE ${process.env.DATABASE_NAME}
        `
        connection.query(use_sql, (err) => {
            if(err) throw err;
        })
        
        //create table
        let table_sql = `
        CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} (
            order_id int primary key auto_increment,
            order_description varchar(300),
            order_reference varchar(20),
            order_date timestamp);
        `;
        connection.query(table_sql, (err) => {
        if (err) throw err;
            console.log(`${process.env.TABLE_NAME} table connected`);
        });

    })
}

function endConnection() {
    connection.end((err) => {
        if(err) {
            console.error("Error closing database: ", err);
        }
        console.log("Database closed");
    })
};

export async function addOrder(order_description, order_reference) {
    try {
        connectToDatabase();
        let sql = `
        INSERT INTO orders (order_description, order_reference)
         VALUES (?, ?)
        `;
        connection.query(sql, [order_description, order_reference])
        console.log("Order inserted successfully");
        endConnection();
    } catch(err) {
        console.error("Error inserting into database", err);
    }
}


export async function getOrder(order_id) {
    try {
        connectToDatabase();
        let sql = `
        SELECT * FROM orders
        WHERE order_id = ?
        `
        await connection.query(sql, [order_id]);
        console.log("Order retrieved successfully");
        endConnection();
    } catch(err) {
        console.error("Error fetching from database: ", err);
    }
}
