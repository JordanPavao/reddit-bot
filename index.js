const { info } = require('console');
const { Client, MessageEmbed, Channel } = require('discord.js');
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
        let info;

        count++;

        getAPI(count).then(function(data) {
            info = data;
            message.channel.send(info);
        });

        console.log(count)
        //go next
    } else if(command === 'prev') {
        let info;

        count--;
        //console.log(count)

        getAPI(count).then(function(data) {
            info = data;
            message.channel.send(info);
        });
    } else {
        let info;

        count = 0;
        subreddit = command;

        // Function call to get information from embed
        getAPI(count).then(function(data) {
            info = data;
            message.channel.send(info);
        });
    }
});

// Calls Api with user requested subreddit
function getAPI(index) {
    return fetch(`${api_path}${subreddit}${api_key}`).then(function(response) {
        return response.json();
    }).then(function(json) {
        try {
            return embedData(json, index);
        }
        catch(err) {
            console.log(err)
            return('Subreddit is private / does not exist');
        }
    });
}


// Function returns embedded message with requested subreddit's data
function embedData(json, index) {
    let subredditInfo = new MessageEmbed()
        .setColor('#FF2E00')
        .setAuthor(`u/${json.data.children[index].data.author}`, 'https://i.imgur.com/jZdCrpv.png')
        .setTitle(json.data.children[index].data.title)

        .setTimestamp()

        .setDescription('[Link](https://www.reddit.com' +json.data.children[index].data.permalink + ')')

        // Verify that url ends with .jpg
        if(json.data.children[index].data.url.endsWith(".jpg") || json.data.children[index].data.url.endsWith(".png")) {
            subredditInfo.setImage(json.data.children[index].data.url)
        }
    return subredditInfo;
}

client.login(token);
