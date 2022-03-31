module.exports = async (client) => {
const express = require("express");
const app = express();
app.use(express.json());
const porte = app.listen(3000, async ()=>{
    console.log(`API Open At Port: ${porte.address().port}`);
});
app.post("/api/appeals/:id", async (req, res)=>{
const info = req.body;
const id = req.params.id;
if(!info) return res.status(400).send({error: "No data was provided."});
console.log(info)
});
}