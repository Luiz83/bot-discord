import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import dotenv from 'dotenv';

dotenv.config();

export async function NotifyNewMember() {
    const client = new Client({ intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

    const TOKEN = process.env.DISCORD_TOKEN;

    try {

        client.once('ready', async (c) => {
            console.log("Ready")
        });

        client.on('guildMemberAdd', async (member) => {

            const Embed = new EmbedBuilder()
                .setColor(0xfd3c23)
                .setTitle("Bem-vindo(a)!")
                .setDescription("Não se esqueça de reagir a mensagem no canal #acesso para poder visualizar todo o conteúdo do servidor!")
            
                await member.send({ embeds: [Embed] });
        });

        client.login(TOKEN);

    } catch (error) {
        console.log("Deu ruiim")
        console.log(error)
        client.destroy();
        await NotifyNewMember()
    }

}
