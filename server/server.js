import express from 'express';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("../client"));

import { initializeDatabase, addOrder, getOrder, getOrders } from "./database.js";


app.post("/order", async (req, res) => {
    const {
        order_description, 
        order_reference,
        recipient
    } = req.body;
    await addOrder(order_description, order_reference, recipient);
    res.redirect("/success");
})

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/success.html"));
})

//display specific order details
app.get("/order/:id", async(req, res) => {
    const order_id = req.params.id;
    const order = await getOrder(order_id);
    res.json(order);
})

//home page
app.get("/admin", async (req, res) => {
    const orders = await getOrders();
    res.json(orders);
})

app.listen(5000, async () => {
    await initializeDatabase();
    console.log("Express server started on port 5000");
});