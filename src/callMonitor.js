import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export async function CallMonitor() {
  const client = new Client({ intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

  const TOKEN = process.env.DISCORD_TOKEN;
  const GUILD_ID = process.env.GUILD_ID;
  const REACTION_ROLE_MAPPING = {
    '🔔': process.env.MONITOR_ROLE_ID
  };

  try {

    client.once('ready', async (c) => {
      console.log("Ready")
    });

    client.on('messageCreate', async (message) => {
      if (message.member.roles.cache.has(process.env.BOT_ROLE_ID)) return; //ignorando msg do bot

      if (message.channel.name != "preciso-de-ajuda") return;

      if (message.content === '!addHelper') {
        const Embed = new EmbedBuilder()
          .setColor(0xfd3c23)
          .setTitle("Precisa de ajuda?")
          .setDescription("Se você está precisando tirar dúvida com o monitor, mas ele já está atendendo outra pessoa, basta reagir a essa mensagem e outro monitor virá lhe ajudar!")
        const sendMessage = await message.channel.send({ embeds: [Embed] });
        sendMessage.react('🔔');
      }
    });

    client.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.message.partial) reaction.message.fetch();
      if (reaction.partial) reaction.fetch();

      if (user.bot) return;
      if (!reaction.message.guild) return;

      const fullMessage = await reaction.message.fetch();
      if (!fullMessage.embeds[0]) return;
      if (fullMessage.embeds[0].title != "Precisa de ajuda?") return

      if (reaction.message.guild.id === GUILD_ID && REACTION_ROLE_MAPPING[reaction.emoji.name]) {
        const sendMessage = (`<@&${REACTION_ROLE_MAPPING[reaction.emoji.name]}>`)
        await fullMessage.channel.send(sendMessage).then(msg => setTimeout(() => {
          msg.delete();
        }, "300000")
        )
      }
    });

    client.login(TOKEN);

  } catch (error) {
    console.log("Deu ruiim")
    console.log(error)
    client.destroy();
    await CallMonitor()
  }

}