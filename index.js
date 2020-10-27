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

    // Data Receiving Variable
    let info;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'help') {
        //do something

    // Command 'n' represents a request to display the next entry
    } else if(command === 'n') {
        
        count++;

        getAPI(count).then(function(data) {
            info = data;
            message.channel.send(info);
        });

        console.log(count)

    // Command 'p' represents a request to display the previous entry
    } else if(command === 'p') {
        // Check if a valid subreddit exists
        if(subreddit === "") {
            message.channel.send("Please enter a valid subreddit before requesting previous subreddit entries");
            return;
        }

        // Ensure that more than one subreddit entry has been displayed so that a previous entry may be output
        else if(count <= 0) {
            message.channel.send("The post above is the first entry in the subreddit");
            return;
        }
        else {
            count--;
            //console.log(count)
    
            getAPI(count).then(function(data) {
                info = data;
                message.channel.send(info);
            });
        }
    } else {
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
    if(subreddit === "") {
        return "Please enter a valid subreddit";
    }

    return fetch(`${api_path}${subreddit}${api_key}`).then(function(response) {
        return response.json();
    }).then(function(json) {
        try {
            return embedData(json, index);
        }
        catch(err) {
            console.log(err)

            // Setting subreddit = "" ensures that previous functions is not used on invalid subreddit
            subreddit = "";
            return('Subreddit is private / does not exist, Please enter a new subreddit!');
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
