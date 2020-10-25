const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { prefix, token } = require('./config.json');


const client = new Client();

const api_path = "https://www.reddit.com/r/";
var subreddit = "";
const api_key = "/.json";

// Count Variable
let count = 0;

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'help') {
        //do something
    } else if(command === 'n') {
        count++;
        console.log(count)
        //go next
    } else if(command === 'prev') {
        //go prev
    } else {
        count = 0;
        subreddit = command;
        getAPI();
    }
});

// Calls Api with user requested subreddit
function getAPI() {

    fetch(`${api_path}${subreddit}${api_key}`).then(function(response) {
        if(response.ok) {
            console.log("made it");
            return response.json();
        } else {
            throw new Error('Error');
        }
    }).then(function(json) {

        embedData(json);
        /*for (let i = 0; i < json.data.children.length; i++) {
            console.log('https://www.reddit.com'+json.data.children[i].data.permalink);
        }*/
       
    });
}

client.login(token);
