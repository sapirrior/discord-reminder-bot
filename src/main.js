import "dotenv/config";
import { Client, GatewayIntentBits, Events} from "discord.js"

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

client.once(Events.Client.Ready, client => {
  console.log(`Logged in as ${client.user?.tag}`);

  client.user?.setActivity({
    name: "Reminders",
    type: 3
  });
})

const reminders = new Map();

