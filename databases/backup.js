const { exec } = require("child_process");
console.log("Database backup loaded")
setInterval(async () => {
await exec("git add .");
await exec("git commit -m \"Scheduled commits\"");
await exec("git push");
console.log("Database backed up")
}, 10*60*60*2)