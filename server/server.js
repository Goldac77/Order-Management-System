import express from 'express';

const app = express();
app.use(express.json());

import { connectToDatabase, addOrder, getOrder, getOrders } from "./database.js";


app.post("/order", async (req, res) => {
    const {order_description, order_reference} = req.body;
    const order = await addOrder(order_description, order_reference);
    res.send(order);
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