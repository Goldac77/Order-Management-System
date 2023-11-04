import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static("client"));

import { connectToDatabase, addOrder, getOrder, getOrders } from "./database.js";


app.post("/order", async (req, res) => {
    const {
        order_description, 
        order_reference,
        emailSubject,
        emailContent,
        recipientsList
    } = req.body;
    const order = await addOrder(order_description, order_reference, emailSubject, emailContent, recipientsList);
    res.send(order);
})

//display specific order details
app.get("/order/:id", async(req, res) => {
    const order_id = req.params.id;
    const order = await getOrder(order_id);
    res.json(order);
})

//home page
app.get("/", async (req, res) => {
    const orders = await getOrders();
    res.json(orders);
})

app.listen(5000, async () => {
    await connectToDatabase();
    console.log("Express server started on port 5000");
});