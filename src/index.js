require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const app = new express()
app.use(express.json())

const port = process.env.port

//Model
const Order = mongoose.model('Product', {
    nome_cliente: String,
    valor_compra: Number,
    cpf: String,
    produtos: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    endereco_entrega: String,
    status: String,
    date: {
        type:Date,
        default: Date.now,
    }
})

//Save a new order
app.post("/save_order", async (req, res) => {
    const order = new Order({
        nome_cliente: req.body.nome_cliente,
        valor_compra: req.body.valor_compra,
        cpf: req.body.cpf,
        produtos: req.body.produtos,
        endereco_entrega: req.body.endereco_entrega,
        status: req.body.status,
        date: new Date()
    })

    await order.save()
    res.status(201).json({ message: "Order saved successfully!" })
})

//List orders
app.get("/", async (req, res) => {
    return res.json("hello world");
})

app.get("/orders", async (req, res) => {
    const orders = await Order.find()
    return res.send(orders)
})

//Update order
app.put("/update_order_:id", async (req,res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        nome_cliente: req.body.nome,
        valor_compra: req.body.valor_compra,
        cpf: req.body.cpf,
        produtos: req.body.produtos,
        endereco_entrega: req.body.endereco_entrega,
        status: req.body.status,
        date: req.body.date
    }, {
        new: true
    })

    return res.send(order)
})

app.listen(port, () => {
    mongoose.connect(process.env.mongodb_connection_order)
    console.log("API running")
})