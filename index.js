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
        count++;
        console.log(count)
        //go next
    } else if(command === 'prev') {
        //go prev
    } else {
        count = 0;
        subreddit = command;
        let info;

        // Function call to get information from embed
        getAPI().then(function(data) {
            info = data;
            message.channel.send(info);
        });
    }
});

// Calls Api with user requested subreddit
function getAPI() {
    return fetch(`${api_path}${subreddit}${api_key}`).then(function(response) {
        return response.json();
    }).then(function(json) {
        try {
            return embedData(json, 0);
        }
        catch(err) {
            console.log(err)
            return('Subreddit is private / does not exist');
        }
    });
    // return fetch(`${api_path}${subreddit}${api_key}`).then(function(response) {
    //     if(response.ok) {
    //         return response.json();
    //     } else {
    //         return "Error, Invalid Subreddit";
    //     }
    // }).then(function(json) {
    //     if(json === "Error, Invalid Subreddit") {
    //         return "Error, Invalid Subreddit";
    //     } else {
    //         return embedData(json);
    //     }
    // });


}


// Function returns embedded message with requested subreddit's data
function embedData(json, index) {

    index = 5;

    //console.log(json.data.children[3]);
    console.log(json.data.children[3].data.title);
    console.log(json.data.children[3].data.thumbnail);
    console.log(json.data.children[3].data.permalink);
    console.log(json.data.children[3].data.url);
    console.log(json.data.children[3].data.author);
    console.log(json.data.children[3].data.subreddit);
    let subredditInfo = new MessageEmbed()
        .setColor('#FF2E00')
        
        .setAuthor(`u/${json.data.children[index].data.author}`)
        .setTitle(json.data.children[index].data.title)

        .setFooter(`https://www.reddit.com${json.data.children[index].data.permalink}`)

        //.addField("Link","(https://www.reddit.com" +json.data.children[index].data.permalink)

        // Verify that url ends with .jpg
        if(json.data.children[index].data.url.endsWith(".jpg") || json.data.children[index].data.url.endsWith(".png")) {
            subredditInfo.setImage(json.data.children[index].data.url)
        }

        

    return subredditInfo;

            /*for (let i = 0; i < json.data.children.length; i++) {
            console.log('https://www.reddit.com'+json.data.children[i].data.permalink);
        */
}

client.login(token);
