const { Client, MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const { prefix, token } = require('./config.json');
const client = new Client();


client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    axios
    .get(command)
    .then((response) => {
        console.log(response.data);
    })
    .catch((err) => {
        console.log(err);
    });
});


client.login(token);
