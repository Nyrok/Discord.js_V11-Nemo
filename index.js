const discord = require("discord.js");
const Discord = require("discord.js");
const bot = new discord.Client();
const figlet = require("figlet");
const colors = require("colors");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./database.json");
const db = low(adapter);
const ms = require('ms')
db.defaults({ config: [], blacklist: []}).write();
bot.commands = new Discord.Collection()
bot.login('NzAxODcxODA4MTQzNjg3Nzcx.XqB_qQ.is9_3pGNKHB5YyWKaSh46FM8xcw');

bot.on("ready", () => {
  console.log(figlet.textSync("némo").cyan);
  bot.user.setActivity("Copyright", { type: "STREAMING" });
  bot.user.setStatus("idle");
  let statues = ["@Nyrok10 and @Ssh9334 on Twitter", "Nemo-V1", `"." is the basic prefix.`, "Nemo-Project", "Nemo-Bêta"];
    setInterval(function(){
    let status = statues[Math.floor(Math.random()*statues.length)];
        bot.user.setActivity(status, {type: "LISTENING"});
        bot.user.setStatus("idle");
    }, 5000)
});
bot.on("guildCreate", guild => {
  db.get("config").push({id: guild.id, prefix: "."}).write();
  let defaultChannel = "";
  guild.channels.forEach(channel => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  });
  
  const hiy = new discord.RichEmbed()
    .setTitle("[📌] **Bot ajouté**")
    .setDescription(
      `:white_check_mark: Merci de m'avoir ajouté à votre serveur! Pour obtenir la liste de mes commandes, veuillez faire .help`
    )
    .setFooter(
      "@Nyrok10 and @Ssh9334 on Twitter",
      "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
    )
    .setImage("https://media.giphy.com/media/AHj0lQstZ9I9W/giphy.gif")
    .setTimestamp();
  defaultChannel.send(hiy);
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if(message.content.startsWith(prefix + "prefix")){
    let args = message.content.split(" ").slice(1)
    let prfx = args[0]
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas la permission d'effectuer cette commande. :x:")
    if(!prfx) return message.channel.send("Le préfixe du bot est `" + prefix + "`.")
    db.get("config").pop({id: message.guild.id}).write();
    db.get("config").push({id: message.guild.id, prefix: prfx}).write();
    message.channel.send(`Le nouveau préfixe du serveur est **${prfx}**. :white_check_mark:`)
    delete require.cache[require.resolve(`./database.json`)];
  }
  if(message.content.startsWith(prefix + "blacklist")){
    if(!(message.author.id === "574039998379065348" || message.author.id === "660937414361219072")) return message.channel.send(":x: Vous n'êtes pas un propriétaire du bot pour utiliser cette commande!")
    let args = message.content.split(" ").slice(1)
    args[0] = message.mentions.members.first()
    var u = args[0] 
    if(!u) return message.channel.send("Veuillez mentionner un utilisateur ! :x:")
    else{
        db.get("blacklist").push({id: u.id}).write()
        message.channel.send(`<@${u.id}> a bien été blacklist du bot ! :white_check_mark:`)
    }
  }
  if(message.content.startsWith(prefix + "pardon")){
    if(!(message.author.id === "574039998379065348" || message.author.id === "660937414361219072")) return message.channel.send(":x: Vous n'êtes pas un propriétaire du bot pour utiliser cette commande!")
    let args = message.content.split(" ").slice(1)
    args[0] = message.mentions.members.first()
    var u = args[0] 
    if(!u) return message.channel.send("Veuillez mentionner un utilisateur ! :x:")
    else{
        db.get("blacklist").pop({id: u.id}).write()
        message.channel.send(`<@${u.id}> a bien été retiré de la blacklist du bot ! :white_check_mark:`)
    }
}
})

bot.on('message', async message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "ban")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") { 
      return;
    }
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        ":x: Tu n'as pas la permission d'utiliser cette commande !"
      );
    const yrr = message.mentions.users.first();
    if(!yrr){
      return message.channel.send(":x: Je n'ai pas trouvé l'utilisateur !")
    }
    
    await message.guild.ban(yrr)
      message.channel.send(
        `${yrr.username} a été ban par ${message.author.username}`
  )
    }
  })
    bot.on('message', message => {
      const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content === prefix + "serverinfo") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    const si = new Discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle("**[📡] INFORMATIONS DU SERVEUR**")
      .setDescription("**— — — — (" + prefix + "serverinfo) — — — —**")
      .addField(
        `Voici les informations du serveur **${message.guild.name}** :`,
        `Propriétaire: ${message.guild.owner}, (${message.guild.ownerID})\nID: **${message.guild.id}**,\nNombre de membre: **${message.guild.memberCount}**\nNombre de channels: **${message.guild.channels.size}**\nNombre de rôles: **${message.guild.roles.size}**\nDate de création: **${message.guild.createdAt}**`
      )
      .setColor("CYAN")
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setTimestamp()
      .setThumbnail(message.guild.iconURL);
    message.channel.send(si);
  }
    })
    bot.on('message', message => {
      const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
      let args = message.content.split(" ").slice(1);
  if (message.content.startsWith(prefix + "say")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    let argy = args.join(" ");
    if (!argy)
      return message.channel.send(":x: Vous n'avez pas entré de message!");
    message.delete();
    let say = new Discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle(`${argy}`)
      .setColor("CYAN")
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setTimestamp()
      .setThumbnail(message.author.avatarURL);
    message.channel.send(say);
  }
    })
bot.on("message", async message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
    const usereeee = message.mentions.users.first();
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    let tr =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    if (message.content.startsWith(prefix + "kick")) {
      if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
      if(!message.member.hasPermission("KICK_MEMBERS")){
        return message.channel.send(`:x: Tu n'as pas la permission d'utiliser cette commande !`)
      }
      if(!tr){
    return message.channel.send(':x: Tu dois spécifier un utilisateur à kick!')

      }
      if (tr) {
        await tr.kick();
        message.channel.send(`${usereeee.username} a été kick avec succès!`);
      }
    }
})
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "rolecreate")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
      return;
    }
    if (!message.content.startsWith(prefix + "rolecreate ")) {
      return;
    }
    var newm = message.content.replace(prefix + "rolecreate ", "");

    message.guild.createRole({
      name: newm,
      hoist: true,
      mentionable: false,
      permissions: 104193089
    });
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "rolecreate")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    if (!message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
      return message.channel.send(
        ":x: Tu n'as pas la permission d'utiliser cette commande !"
      );
    }
    if (!message.content.startsWith(prefix + "rolecreate ")) {
      return message.channel.send(":x: Vous devez donner un nom à votre rôle!");
    }
    var newmessage = message.content.replace(prefix + "rolecreate ", "");
    const hhjk = new discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle("✔️ **Rôle créé**")
      .setDescription("Un rôle nommé " + newmessage + " à été créé!")
      .setThumbnail(bot.user.avatarURL)
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setTimestamp();
    message.channel.send(hhjk);
  }
});
bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content.startsWith(prefix + "name")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      return;
    }
    if (!msg.content.startsWith(prefix + "name ")) {
      return msg.channel.send(":x: Vous devez préciser le nouveau nom du bot!");
    }
    const klou = msg.content.replace(prefix + "name ", "");
    msg.guild.member(bot.user).setNickname(klou);
  }
});
bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content.startsWith(prefix + "name")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (!msg.member.hasPermission("MANAGE_GUILD")) {
      return msg.channel.send(
        ":x: Tu n'as pas la permission d'utiliser cette commande !"
      );
    }
    if (!msg.content.startsWith(prefix + "name ")) {
      return;
    }
    const klou = msg.content.replace(prefix + "name ", "");
    const kkd = new discord.RichEmbed()
      .setAuthor(
        msg.author.username + "#" + msg.author.discriminator,
        msg.author.displayAvatarURL
      )
      .setTitle("Name")
      .setDescription("Le nom du bot sur votre serveur est maintenant: " + klou)
      .setTimestamp()
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setThumbnail(bot.user.avatarURL);
    msg.channel.send(kkd);
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content === prefix + "invite") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    const jrt = new discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle("[🌹] **Invitation**")
      .setURL(
        "https://discordapp.com/api/oauth2/authorize?client_id=701871808143687771&permissions=2147483639&scope=bot"
      )
      .setTimestamp()
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setThumbnail(bot.user.avatarURL);
    message.channel.send(jrt);
  }
});

bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "tchannel")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return;
    }
    if (!message.content.startsWith(prefix + "tchannel ")) {
      return;
    }
    var lol = message.content.replace(prefix + "tchannel ", "");
    message.guild.createChannel(`${lol}`, "text");
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "tchannel")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return message.channel.send(
        ":x: Tu n'as pas la permission d'utiliser cette commande !"
      );
    }
    if (!message.content.startsWith(prefix + "tchannel ")) {
      return message.channel.send(
        ":x: Vous devez donner un nom à votre channel!"
      );
    }
    var lol = message.content.replace(prefix + "tchannel", "");
    const hh = new discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle("[✔️] **Tchannel**")
      .setDescription("Un salon textuel nommé " + lol + " a été créé!")
      .setThumbnail(bot.user.avatarURL)
      .setTimestamp()
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      );
    message.channel.send(hh);
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "vchannel")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return;
    }
    if (!message.content.startsWith(prefix + "vchannel ")) {
      return;
    }
    var lol = message.content.replace(prefix + "vchannel ", "");
    message.guild.createChannel(`${lol}`, "voice");
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "vchannel")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return message.channel.send(
        ":x: Tu n'as pas la permission d'utiliser cette commande !"
      );
    }
    if (!message.content.startsWith(prefix + "vchannel ")) {
      return message.channel.send(
        ":x: Vous devez donner un nom à votre channel!"
      );
    }
    var lol = message.content.replace(prefix + "vchannel", "");
    const hh = new discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle("[✔️] **Vchannel**")
      .setDescription("Un salon vocal nommé " + lol + " a été créé!")
      .setThumbnail(bot.user.avatarURL)
      .setTimestamp()
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      );
    message.channel.send(hh);
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content.startsWith(prefix + "reactrole")) {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(
        ":x: Tu n'as pas la permission d'utiliser cette commande !"
      );
    }
    var role34 = message.mentions.roles.first();
    if (!role34) {
      return message.channel.send(":x: Vous devez ping le rôle voulu!");
    }
    var e = new discord.RichEmbed()
      .setTitle("[💡] **Rôle**")
      .setDescription(
        "Veuillez appuyer sur ✅ pour obtenir le rôle " + role34 + " !"
      )
      .setThumbnail(bot.user.avatarURL)
      .setTimestamp()
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      );
    message.channel.send(e).then(sentMessage => {
      sentMessage.react("✅");
      bot.on("messageReactionAdd", (reaction, user) => {
        if (!user.bot) {
          reaction.message.guild.member(user).addRole(role34.id);
        }
      });
    });
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content === prefix + "pp") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    const embed = new discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle("[📋] **PP**")
      .setDescription(
        `Voici la photo de profile de ${message.author.username} !`
      )
      .setImage(`${message.author.avatarURL}`)
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setTimestamp();
    message.channel.send({ embed });
  }
});
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
    if (message.content.startsWith(prefix + "pp")) {
      if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
if (message.channel.type === "dm") {
      return;
    }
      var tre = message.mentions.users.first();
      if (tre) {
    const embed = new discord.RichEmbed()
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setTitle("[📋] **PP**")
      .setDescription(
        `Voici la photo de profile de ${tre.username} !`
      )
      .setImage(`${tre.avatarURL}`)
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setTimestamp();
    message.channel.send({ embed });
  }
    }
})
bot.on("message", message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content === prefix + "botinfo") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    const embeed = new discord.RichEmbed()
      .setTitle("[📖] **Informations**")
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setThumbnail(bot.user.avatarURL)
      .addField("**ID: **", bot.user.id)
      .addField("**Nom: **", bot.user.username)
      .addField("**Préfix: **", prefix)
      .addField("**Nombre de serveur: **", bot.guilds.size)
      .addField("**Date de création: **", bot.user.createdAt)
      .addField("**Status actuel: **", bot.user.presence.status)
      .addField("**Version: **", "1.0")
      .addField("**Taille: **", "70MB")
    .addField("**Créateurs: **", 'Mokmi & Nyrok')
      .setTimestamp();
    message.channel.send(embeed);
  }
});
const superagent = require("superagent");

bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content === prefix + "hentai") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (msg.channel.nsfw === true) {
      superagent
        .get("https://nekobot.xyz/api/image")
        .query({ type: "hentai" })
        .end((err, response) => {
          msg.channel.send({ file: response.body.message });
        });
    } else {
      msg.channel.send(":x: Vous devez aller dans un salon NSFW!");
    }
  }
});
bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content === prefix + "ass") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (msg.channel.nsfw === true) {
      superagent
        .get("https://nekobot.xyz/api/image")
        .query({ type: "ass" })
        .end((err, response) => {
          msg.channel.send({ file: response.body.message });
        });
    } else {
      msg.channel.send(":x: Vous devez aller dans un salon NSFW!");
    }
  }
});
bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content === prefix + "pussy") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (msg.channel.nsfw === true) {
      superagent
        .get("https://nekobot.xyz/api/image")
        .query({ type: "pussy" })
        .end((err, response) => {
          msg.channel.send({ file: response.body.message });
        });
    } else {
      msg.channel.send(":x: Vous devez aller dans un salon NSFW!");
    }
  }
});
bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content === prefix + "4k") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (msg.channel.nsfw === true) {
      superagent
        .get("https://nekobot.xyz/api/image")
        .query({ type: "4k" })
        .end((err, response) => {
          msg.channel.send({ file: response.body.message });
        });
    } else {
      msg.channel.send(":x: Vous devez aller dans un salon NSFW!");
    }
  }
});
bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content === prefix + "gif") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (msg.channel.nsfw === true) {
      superagent
        .get("https://nekobot.xyz/api/image")
        .query({ type: "pgif" })
        .end((err, response) => {
          msg.channel.send({ file: response.body.message });
        });
    } else {
      msg.channel.send(":x: Vous devez aller dans un salon NSFW!");
    }
  }
});
bot.on("message", msg => {
  const prefix = db.get("config").find({id: msg.guild.id}).get("prefix").value();
  if (msg.content === prefix + "neko") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (msg.channel.type === "dm") {
      return;
    }
    if (msg.channel.nsfw === true) {
      superagent
        .get("https://nekobot.xyz/api/image")
        .query({ type: "neko" })
        .end((err, response) => {
          msg.channel.send({ file: response.body.message });
        });
    } else {
      msg.channel.send(":x: Vous devez aller dans un salon NSFW!");
    }
  }
});
bot.on("message", async message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if (message.content === prefix + "help") {
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
    var yy = new discord.RichEmbed()
      .setTitle("[❇️] **Help**")
      .setAuthor(
        message.author.username + "#" + message.author.discriminator,
        message.author.displayAvatarURL
      )
      .addField(
        "**Veuillez choisir une des réactiomns ci-dessous**",
        "1️⃣ `Menu help modération`,\n2️⃣ `Menu help serveur`,\n3️⃣ `Menu help NSFW`,\n4️⃣ `Menu help autres`."
      )
      .setThumbnail(bot.user.avatarURL)
      .setFooter(
        "@Nyrok10 and @Ssh9334 on Twitter",
        "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
      )
      .setTimestamp();
    var ff = await message.channel.send(yy)
    await ff.react("1️⃣");
    await ff.react("2️⃣");
    await ff.react("3️⃣");
    await ff.react("4️⃣");
  }
  bot.on("messageReactionAdd", async (reaction, user) => {
    if(db.get("blacklist").find({id: user.id}).value()) return;
    if (reaction.emoji.name === "1️⃣") {
      var jre = new discord.RichEmbed()
        .setTitle("[🌀] **Menu modération**")
        .setAuthor(
          message.author.username + "#" + message.author.discriminator,
          message.author.displayAvatarURL
        )
        .setDescription("Voici les commandes modération")
        .setThumbnail(bot.user.avatarURL)
        .addField(prefix + "ban", "Banni un utilisateur")
        .addField(prefix + "kick", "Kick un utilisateur")
        .addField(prefix + "mute", "Mute un utilisateur")
        .setFooter(
          "@Nyrok10 and @Ssh9334 on Twitter",
          "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
        )
        .setTimestamp();
      if (user.bot) return;
       await ff.edit(jre);
      ff.react("🔙");
      reaction.remove(user);
    } else if (reaction.emoji.name === "2️⃣") {
      var j = new discord.RichEmbed()
        .setTitle("[🎴] **Menu serveur**")
        .setAuthor(
          message.author.username + "#" + message.author.discriminator,
          message.author.displayAvatarURL
        )
        .setDescription("Voici les commandes serveur")
        .setThumbnail(bot.user.avatarURL)
        .addField(prefix + "reactrole", "Crée un reaction role")
        .addField(prefix + "tchannel", "Crée un salon textuel")
        .addField(prefix + "vchannel", "Crée un salon vocal")
        .addField(prefix + "rolecreate", "Crée un role")
        .addField(prefix + "name", "Donne un nom au bot sur votre serveur")
        .addField(
          prefix + "serverinfo",
          "Donne des informations sur le serveur"
        )
        .addField(
          prefix + "prefix",
          "Change le prefix du bot dans votre serveur"
        )
        .addField(prefix + "purge", "Supprime des messages")
        .addField(prefix + "rolegive", "Donne un rôle à un membre")
        .setFooter(
          "@Nyrok10 and @Ssh9334 on Twitter",
          "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
        )
        .setTimestamp();
      if (user.bot) return;
      await ff.edit(j);
      ff.react("🔙");
      reaction.remove(user);
    } else if (reaction.emoji.name === "3️⃣"){
      var fd = new discord.RichEmbed()
        .setTitle("[🏧] **Menu NSFW**")
        .setAuthor(
          message.author.username + "#" + message.author.discriminator,
          message.author.displayAvatarURL
        )
        .setDescription("Voici les commandes NSFW")
        .addField(prefix + "4k", "Envoie une image 4k")
        .setThumbnail(bot.user.avatarURL)
        .addField(prefix + "gif", "Envoie un gif porno")
        .addField(
          prefix + "hentai",
          "Envoie une image ou un gif selon votre chance"
        )
        .addField(prefix + "pussy", "Envoie une image pussy")
        .addField(prefix + "ass", "Envoie une image ass")
        .addField(prefix + "neko", "Envoie une image neko")
        .setFooter(
          "@Nyrok10 and @Ssh9334 on Twitter",
          "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
        )
        .setTimestamp();
      if (user.bot) return;
      await ff.edit(fd);
      ff.react("🔙");
      reaction.remove(user);
    } else if (reaction.emoji.name === "4️⃣") {
      var jg = new discord.RichEmbed()
        .setTitle("[🌐] **Menu autres**")
        .setAuthor(
          message.author.username + "#" + message.author.discriminator,
          message.author.displayAvatarURL
        )
        .setDescription("Voici les commandes autres")
        .addField(prefix + "botinfo", "Donne des infos sur le bot")
      .addField(prefix + "8ball", "Donne une réponse aléatoire à votre question")
        .addField(prefix + "pp", `Donne la pp d'un membre ou de vous même`)
        .setThumbnail(bot.user.avatarURL)
        .addField(
          prefix + "userinfo",
          "Donne des infos sur un membre ou sur vous même"
        )
        .addField(prefix + "invite", `Vous donne l'invitation du bot`)
        .addField(prefix + "say", `Renvoie votre message en embed`)
        .setFooter(
          "@Nyrok10 and @Ssh9334 on Twitter",
          "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
        )
        .setTimestamp();
      if (user.bot) return;
      await ff.edit(jg);
      ff.react("🔙");
      reaction.remove(user);
    } else if (reaction.emoji.name === "🔙") {
      var uui = new discord.RichEmbed()
        .setTitle("[❇️] **Help**")
        .setAuthor(
          message.author.username + "#" + message.author.discriminator,
          message.author.displayAvatarURL
        )
        .addField(
          "**Veuillez choisir une des réactiomns ci-dessous**",
          "1️⃣ `Menu help modération`,\n2️⃣ `Menu help backup`,\n3️⃣ `Menu help serveur`,\n4️⃣ `Menu help NSFW`,\n5️⃣ `Menu help autres`."
        )
        .setThumbnail(bot.user.avatarURL)
        .setFooter(
          "@Nyrok10 and @Ssh9334 on Twitter",
          "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
        )
        .setTimestamp();

      if (user.bot) return;
      await ff.edit(uui);
      reaction.removeAll(user);
    }
  });
});
bot.on('message', message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  let arg = message.content.substring(prefix.length).split(" ");
if (message.channel.type === "dm") {
      return;
    }
  switch (arg[0]) {
      case 'mute':
          if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
          var person  = message.guild.member(message.mentions.users.first() || message.guild.members.get(arg[1]));
   if(!message.member.hasPermission("ADMINISTRATOR")){
        return message.channel.send(":x: Tu n'as pas la permission d'utiliser cette commande !")
      }
          if(!person){    

           return message.channel.send(":x: Vous devez choisir une personne à mute!")
          }
         
          let role = message.guild.roles.find(role => role.name === "mute");
 

          if(!role){
          try{
             message.guild.createRole({
              name: "mute",
              color: "#000000",
              permissions:[]
            })
            message.guild.channels.forEach(async (channel, id) => {
               channel.overwritePermissions(role, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });
            });
          }catch(e){
            console.log(e.stack);
          }
        }
if(!role){
  return message.channel.send(`:white_check_mark: J'ai créé un rôle nommé mute. Veuillez réessayer de mute la personne!`)
}
          let time = arg[2];
          if(!time){
       
      return  message.channel.send(':x: Vous devez spécifier combien de temps vous voulez que la personne soit mute! (1s/m/h/d)')
          }
          person.addRole(role);

     
        message.channel.send  (`${person.user.tag} a été mute durant ${ms(ms(time))}`)
            setTimeout(function(){
              console.log(role)
            
            message.channel.send  (`${person.user.tag} est maintenant unmute!`)
          }, ms(time));

      break;
  }
})
bot.on('message', message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  const { getMember, formatDate } = 
  module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    }
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
   const member = getMember(message, args.join(" "));
   const joined = formatDate(member.joinedAt);
    if (message.content.startsWith(prefix + "userinfo")) {
      if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
      if (message.channel.type === "dm") {
      return;
    }
      const user = message.mentions.users.first()
      if(!user){
        return message.channel.send(':x: Vous devez ping un utilisateur!')
      }
           const roles = member.roles
            .map(r => r).slice(1).join(", ") || 'Aucun';
        const embeed = new discord.RichEmbed()
          .setTitle("[📖] **Informations sur: **" + user.username)
          .setThumbnail(member.avatarURL)
          .addField("**ID: **", user.id)
          .addField("**Nom: **", user.username)
          .addField("**Date de création: **", user.createdAt)
          .addField("**Status actuel: **", user.presence.status)
        .addField(`**Rôles: **`, '' + roles, true)
                .addField(`**Arriver dans le serveur: **`, '' + joined, true)
        .setTimestamp()
         .setAuthor(
          message.author.username + "#" + message.author.discriminator,
          message.author.displayAvatarURL
        )
          .setFooter(
          "@Nyrok10 and @Ssh9334 on Twitter",
          "https://cdn.discordapp.com/emojis/590848931852713984.png?v=1"
        )
        message.channel.send(embeed);
    }
})
bot.on('message', message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if(message.content.startsWith(prefix + 'rolegive')){
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
     if(!message.member.hasPermission("ADMINISTRATOR")){
       return message.channel.send(":x: Tu n'as pas la permission d'utiliser cette commande !")
     }
    const ggf = message.mentions.roles.first()
    if(!ggf){
      return message.channel.send(':x: Vous devez ping un rôle!')
    }
   const jf = message.mentions.members.first()
    if(!jf){
      return message.channel.send(':x: Vous devez ping un utilisateur!')
    }
    jf.addRole(ggf.id);
    message.channel.send(':white_check_mark: ' + jf + ' a bien reçu le rôle ' + ggf.name)
  }
})
bot.on('message', message => {
  const prefix = db.get("config").find({id: message.guild.id}).get("prefix").value();
  if(message.content.startsWith(prefix + '8ball')){
    if(db.get("blacklist").find({id: message.author.id}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
    if (message.channel.type === "dm") {
      return;
    }
         var sayings = [
        "Oui",
        "Non",
        "Peut-être",
        "Je ne sais pas",
        "Sûrement pas",
        "Réessaye encore",
        "Je ne peux pas répondre à cela pour l'instant",
        "Je ne crois pas",
        "Ça m'étonnerait!",
      ];
      var result = Math.floor(Math.random() * sayings.length + 0);
    if(result == 1){
      message.channel.send('Oui')
    }else if(result == 2){
      message.channel.send('Non')
    }else if(result == 3){
      message.channel.send('Peut-être')
    }else if(result == 4){
      message.channel.send('Je ne sais pas')
    }else if(result == 5){
      message.channel.send('Sûrement pas')
    }else if(result == 6){
      message.channel.send('Réessaye encore')
    }else if(result == 7){
      message.channel.send("Je ne peux pas répondre à cela pour l'instant")
    }else if(result == 8){
      message.channel.send('Je ne crois pas')
    }else if(result == 9){
      message.channel.send("Ça m'étonnerait!")
    }
  }
})
