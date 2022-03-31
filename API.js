module.exports = async (client) => {
const express = require("express");
const app = express();
app.use(express.json());
const porte = app.listen(3000, async ()=>{
    console.log(`API Open At Port: ${porte.address().port}`);
});
client
}