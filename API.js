const { MessageEmbed } = require("discord.js");
const appealSchema = require("./apiSchemas/appealSchema");
async function sendAppeal(client, data){
    const channel = client.channels.cache.get(client.config.mainServer.channels.modlogs);
    const embed = new MessageEmbed().setTitle(`Case #${data.case_id}`).addFields({name: "Information:", value: `ID: ${data.user_id}\nTag: ${data.tag}\nModerator: <@${data.moderator}>`}, {name: "Moderator's Punishment Reasoning:", value: `${data.moderator_reason}`}, {name: "User's Punishment Reasoning:", value: `${data.user_reason}`}, {name: "User's Appeal:", value: `${data.appeal_reason}`});
    channel.send({embeds: [embed]});
}
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
if(!info || !info.type || !info.case_id || !info.appeal_reason || !info.user_reason || !info.moderator) return res.status(400).send({error:{message: "Missing required parameters."}});
if(info.type === "ban"){
    const ban = await client.guilds.cache.get(client.config.mainServer.id).bans.fetch(id).catch((e)=>{return null});
    if(!ban) return res.status(404).send({error: {message: "No ban was found with that user ID."}});
    const data = await new appealSchema({
        _id: info.case_id,
        type: "ban",
        data: {
            user_id: info.id,
            tag: info.tag,
            moderator: info.moderator,
            moderator_reason: ban.reason,
            user_reason: info.user_reason,
            appeal_reason: info.appeal_reason
        }
    }).save();
    await sendAppeal(client, data);
    return res.status(200).send({data: data});
} else {
    const punishment = client.punishments._content.find(x=>x.member===id&&x.type===info.type&&x.id===info.case_id);
    if(!punishment) return res.status(404).send({error:{message: "No punishment with that information was found."}});
    const data = await new appealSchema({
        _id: id,
        type: "ban",
        data: {
            user_id: info.id,
            tag: info.tag,
            moderator: punishment.moderator,
            moderator_reason: punishment.reason,
            user_reason: info.user_reason,
            appeal_reason: info.appeal_reason
        }
    }).save();
    await sendAppeal(client, data);
    return res.status(200).send({data: data});
};
});
}