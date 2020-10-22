const { Client, MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const { prefix, token } = require('./config.json');
const client = new Client();

const api_path = "https://www.reddit.com/r/";
const api_key = "/.json";

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'help') {
        //do something
    } else if(command === 'next') {
        //go next
    } else if(command === 'prev') {
        //go prev
    } else {
        axios.get(`${api_path}${command}${api_key}`)
        .then(response => {
            console.log(`${api_path}${command}${api_key}`)
            //console.log(response.data.data.children.map(obj => obj.data))
            const dataArr = response.data.data.children.map(obj => obj.data)
            console.log(dataArr[0].permalink)
        })
        .catch((err) => {
            console.log('ERR:', err)
        })
    }
});

client.login(token);
