const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);

});
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
client.on("message", async message => {
    const welcome = "Please welcome some new members!";
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "png") {
        const m = await message.channel.send("png!?");
        m.edit(`nah man, we use jpg! \n But in all honesty the current server latency is at ${m.createdTimestamp - message.createdTimestamp}ms. and the API latency is at ${Math.round(client.ping)}ms`);
    }
    if (command === "say") {
        if (args[0] === "**" && !args.length > 1) {
            message.channel.send("Usage: `say ** <title> <type> <id> <content...>");
        }
        if (args[0] === "*announce") {
            if (message.member.roles.some(r => ["Administrator", "Lead Developer", "Senior Developer"].includes(r.name))) {
                const title = args[1];
                const type = "Type- " + args[2];
                const label = "\___| " + args[3] + " |___/";
                const content = args.slice(4, args.length - 1);
                message.channel.send({
                    embed: {
                        color: 0xffaa00,
                        author: {
                            name: label,
                            icon_url: client.user.avatarURL
                        },
                        title: title,
                        description: type,
                        fields:
                        [
                            {
                            name: "]-[",
                            value: content
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.avatarURL,
                            text: "copyright © "
                        }
                    }
                });
            }
            else {
                message.channel.send("Sorry, your permissions level is not high enough to execute this command!");
            }
        } else {
            const sayMessage = args.join(" ");
            message.delete().catch(O_o => { });
            message.channel.send(sayMessage);
        }
    }
    if (command === "kick") {
        if (!message.member.roles.some(r => ["Administrator"].includes(r.name)))
            return message.reply("Sorry, your permissions level is not high enough to execute this command!");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply("Please mention a valid member of this server");
        if (!member.kickable)
            return message.reply("dottGRIP Essentials used kick on member... member used NoU... Essentials fainted...");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Go think about what you did!";
        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    }
    if (command === "purge") {
        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        const fetched = await message.channel.fetchMessages({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
    if (command === "bank") {
        if (config.bank_vault > 0) {
            message.channel.send("The bank is currently holding: $", config.bank_vault);
        }
    }
    if (command === "divine") {
        message.channel.send("N/A")
    }
    if (command === "welcome") {
        const string001;
        if (args.size > 0) {
            string001 = args.join(" ");
            message.delete().catch(O_o => { });
            message.channel.send(welcome, string001);
        }
    }
});
client.login(config.token);
