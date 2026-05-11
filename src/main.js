import "dotenv/config";
import { Client, GatewayIntentBits, Events} from "discord.js"
import ms from "ms";

const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, client => {
  console.log(`Logged in as ${client.user?.tag}`);

  client.user?.setActivity({
    name: "Reminders",
    type: 3
  });
})

const reminders = new Map();

client.on(Events.MessageCreate, async msg => {
  if (msg.author.bot) return;

  const userId = msg.author.id
  const cmds = msg.content.trim().split(/\s+/);
  const command = cmds[0];
  const time = cmds[1];
  const rmText = cmds.slice(2).join(" ");

  if (command !== "!remind") return;
  if (!time || !rmText) {
    await msg.reply("USAGE:\n!remind (10m / 6h / 7s) {reminder text}\nEG:\n!remind 10s example task");
    return;
  }

  const delay = ms(time);
  if (!delay || typeof delay !== "number") {
    await msg.reply("Unknown time format.\nEG:\n10m, 10s, 5h");
    return;
  }

  if (reminders.get(userId)) {
    await msg.reply("You cant set a reminder. You already have a running reminder.");
    return;
  }

  reminders.set(userId, true);
  setTimeout(async () => {
    await msg.author.send(`<@${userId}>\nREMINDER:\n${rmText}`);
    reminders.set(userId, false);
  }, delay);

  await msg.reply(`Reminder set for ${ms(delay)}.\nMESSAGE:\n"${rmText}"`);
})

client.login(process.env.TOKEN);
