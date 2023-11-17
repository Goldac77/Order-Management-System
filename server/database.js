import mysql from 'mysql';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

//database configuration
const connection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
})

const email_transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

export function initializeDatabase() {
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
        console.log(`${process.env.DATABASE_NAME} database selected`);
    })
    
    //create table
    let table_sql = `
    CREATE TABLE IF NOT EXISTS ${process.env.TABLE_NAME} (
        order_id int primary key auto_increment,
        order_description varchar(300),
        order_reference varchar(20),
        order_date timestamp default current_timestamp);
    `;
    connection.query(table_sql, (err) => {
        if (err) throw err;
        console.log(`${process.env.TABLE_NAME} table connected`);
    });
}

//function to send email
function sendEmail(emailSubject, emailContent, recipient) {
    //email configuration
    const mail_config = {
        from: process.env.EMAIL_ACCOUNT,
        to: recipient,
        subject: emailSubject,
        text: emailContent
    }

    email_transporter.sendMail(mail_config, (err, info) => {
        if(err) throw err;
        console.log("Email sent successfully")
    })
}

export async function addOrder(order_description, order_reference, recipient) {
    try {
        const emailSubject = "Order to Linkinn Cafe Received";
        const emailContent = `Your order for ${order_description} is being processed`;

        let sql = `
        INSERT INTO orders (order_description, order_reference)
         VALUES (?, ?)
        `;
        connection.query(sql, [order_description, order_reference])
        console.log("Order inserted successfully");
        sendEmail(emailSubject, emailContent, recipient)
    } catch(err) {
        console.error("Error inserting into database", err);
    }
}

//get specific order details
export async function getOrder(order_id) {
    return new Promise((resolve, reject) => {
        try {
            let sql = `
            SELECT * FROM ${process.env.TABLE_NAME}
            WHERE order_id = ?
            `
            connection.query(sql, [order_id], (err, result, fields) => {
                if(err) reject(err);
                resolve(result)
            });
            console.log("Order retrieved successfully");
        } catch(err) {
            console.error("Error fetching from database: ", err);
        }
    })
    
}

//get all order details
export async function getOrders() {
    return new Promise((resolve, reject) => {
        let sql = 
        `
            SELECT * FROM ${process.env.TABLE_NAME}
        `;
        connection.query(sql, (err, result, fields) => {
            if (err) {
                console.error("Error fetching orders: ", err);
                reject(err); // Reject the promise in case of an error
            } else {
                resolve(result); // Resolve the promise with the result
                console.log("Orders retrieved successfully")
            }
        });
    });
}
