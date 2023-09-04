import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export async function GiveRole() {
  const client = new Client({ intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

  const TOKEN = process.env.DISCORD_TOKEN;
  const GUILD_ID = process.env.GUILD_ID;
  const REACTION_ROLE_MAPPING = {
    '👍': process.env.ROLE_TO_GIVE
  };
  try {

    client.once('ready', async (c) => {
      console.log("Ready")
    });
  
    client.on('messageCreate', async (message) => {
      if (message.member.roles.cache.has(process.env.BOT_ROLE_ID)) return; //ignorando msg do bot
  
      if (message.channel.name != "acesso") return;
  
      if (message.content === '!addRole') {
        const Embed = new EmbedBuilder()
          .setColor(0xfd3c23)
          .setTitle("Acesso")
          .setDescription("Se você já leu nossas regras, basta reagir a essa mensagem para receber acesso ao resto do servidor!")
        const sentMessage = await message.channel.send({ embeds: [Embed] });
        sentMessage.react('👍');
      }
    });
  
    client.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.message.partial) reaction.message.fetch();
      if (reaction.partial) reaction.fetch();
  
      if (user.bot) return;
      if (!reaction.message.guild) return;
  
      const fullMessage = await reaction.message.fetch();
      if (!fullMessage.embeds[0]) return;
      if (fullMessage.embeds[0].title != "Acesso") return
  
      if (reaction.message.guild.id === GUILD_ID && REACTION_ROLE_MAPPING[reaction.emoji.name]) {
        const role = reaction.message.guild.roles.cache.get(REACTION_ROLE_MAPPING[reaction.emoji.name]);
        if (role) {
          const member = reaction.message.guild.members.cache.get(user.id);
          if (member) {
            member.roles.add(role)
              .then(() => console.log(`Dado o cargo ${role.name} para ${user.tag}.`))
              .catch(console.error);
          }
        }
      }
    });
  
    client.login(TOKEN);
    
  } catch (error) {
        console.log("Deu ruiim")
        console.log(error)
        client.destroy();
        await GiveRole()
  }

  
}