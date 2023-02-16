const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server is running ")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixsnvhr.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://localhost:27017"

const client = new MongoClient(uri)
async function dbConncet() {
    try {
        await client.connect()
    }
    catch (err) {
        console.error(err)
    }
}
dbConncet().catch(err => console.error(err));

const Product = client.db("emaJohn").collection("products")

app.get("/products", async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const query = {}
        const cursor = Product.find(query)
        const products = await cursor.skip(size * page).limit(size).toArray()
        const count = await Product.estimatedDocumentCount()
        res.send({
            success: true,
            message: "Product data found",
            products,
            count
        })

    }
    catch (err) {
        console.error(err)
        res.send({
            success: false,
            message: err.message
        })
    }
})
app.post("/productsbyids", async (req, res) => {
    try {
        const ids = req.body
        const objectIds = ids.map(id => new ObjectId(id))
        const query = { _id: { $in: objectIds } }
        const cursor = Product.find(query)
        const products = await cursor.toArray()
        res.send(products)
    }
    catch (err) {
        console.error(err)
        res.send({ success: false, message: err.message })
    }
})
app.listen(port, () => { console.log('server up and running') })