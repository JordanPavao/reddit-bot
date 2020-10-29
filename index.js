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

    // Ensures that there is no empty input
    if(command === "") {
        message.channel.send("Please enter a valid subreddit");
        return;
    }

    // Command 'h' represents a request to display the help menu
    if(command === 'h') {
        let helpMenu = new MessageEmbed()
            .setColor('#FF2E00')
            
            .addFields(
                { name: 'r/**{subreddit}**', value: 'shows the first entry for the subreddit entered'},
                { name: 'r/**h**', value: 'shows the help menu with a list of commands for the bot'},
                { name: 'r/**n**', value: 'shows the next entry in the entered subreddit'},
                { name: 'r/**p**', value: 'shows the previous entry in the entered subreddit'}
            )
            
            .setFooter('Reddit Bot • Help Menu')
            .setTimestamp();

        message.channel.send(helpMenu);

    // Command 'n' represents a request to display the next entry
    } else if(command === 'n') {
        if(subreddit === "") {
            console.log(`count${count}`);
            message.channel.send("Please enter a valid subreddit before requesting new subreddit entries");
            return;
        }

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
        console.log(subreddit);

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
            
            if(index === 0) {
                // Setting subreddit = "" ensures that previous/next functions is not used on invalid subreddit
                subreddit = "";
                return('Subreddit is private / does not exist\nPlease enter a new subreddit!');
            } else {
                return('You have hit the max number of entries that this subreddit can display\nView previous entries or Enter a new Subreddit!');
            }

        }
    });
}


// Function returns embedded message with requested subreddit's data
function embedData(json, index) {

    let subredditInfo = new MessageEmbed()
        .setColor('#FF2E00')
        .setAuthor(`u/${json.data.children[index].data.author}`, 'https://i.imgur.com/jZdCrpv.png')
        

        .setTimestamp()

        .setDescription('[Link](https://www.reddit.com' +json.data.children[index].data.permalink + ')')

        // Verify that title is less than or equal to 256 characters
        if((json.data.children[index].data.title).length > 256) {
            let title = (json.data.children[index].data.title).slice(0,252);
            title = title.concat('...');
            subredditInfo.setTitle(title);
        } else {
            subredditInfo.setTitle(json.data.children[index].data.title);
        }

        // Verify that url ends with .jpg
        if(json.data.children[index].data.url.endsWith(".jpg") || json.data.children[index].data.url.endsWith(".png")) {
            subredditInfo.setImage(json.data.children[index].data.url)
        }
    return subredditInfo;
}

client.login(token);
