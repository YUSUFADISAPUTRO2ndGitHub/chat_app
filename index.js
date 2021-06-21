process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
var request = require('request');
const cors = require('cors');
const ejs = require('ejs');
var fs = require('fs');
const app = express();
app.use(cors(), express.static( "public" ) );
app.set('view engine', 'ejs');
const port = 3045;

var local_rooms = [];
setInterval(() => {
    get_all_rooms();
}, 5000);
async function get_all_rooms(){
    await fs.readdir(`./`, async function (err, data) {
        if (err) {
            console.log('fail to save chat! ' + err);
        }else{
            local_rooms = [];
            var i =0;
            for(i; i < data.length; i++){
                if(data[i].includes(".txt")){
                    var selected_data = data[i].split(".");
                    await check_chat(selected_data);
                }
            }
        }
    });
}

async function check_chat(selected_data){
    await fs.readFile(`${selected_data[0]}.txt`, async function(err, data) {
        if (err){
            console.log(err);
        }else{
            if(data.toString().toUpperCase().includes("SAMPAI JUMPAH")){
                if(!selected_data[0].includes('closed')){
                    fs.rename(selected_data[0] + '.txt', selected_data[0] + '-closed.txt', (err) => {
                        if (err){
                            console.log(err);
                        }else{
                            console.log(selected_data[0] + '.txt Rename complete!');
                        }
                    });
                }
            }else{
                await local_rooms.push(selected_data[0]);
                console.log(local_rooms);
            }
        }
    });
}
app.get('/chat-room', (req, res) => {
    res.render('chat.ejs');
})
app.get('/new_chat_room', (req, res) => {
    res.render('request_new_chat_room.ejs');
})
app.get('/cs_enters_chat_room', (req, res) => {
    res.render('customer_service_enters_chat_room.ejs');
})
app.get('/available_chat_rooms', (req, res) => {
    res.render('available_chat_rooms.ejs');
})
app.get('/thank-you', (req, res) => {
    res.render('thank_you.ejs');
})
const path = require('path');
const router = express.Router();
app.get('/ringtone', (req, res) => {
    res.sendFile(path.join(__dirname+'/ringtone.mp3'));
});
app.get('/new-chat-room', (req, res) => {
    var roomNumber = (Math.floor(Math.random() * 999) + 100) + (Math.floor(Math.random() * 999) + 100) + (Math.floor(Math.random() * 999) + 100) + (Math.floor(Math.random() * 999) + 100) + (Math.floor(Math.random() * 999) + 100);
    if(req.query.message != undefined && req.query.name != undefined) {
        var chats = [];
        var chat = {
            name: req.query.name,
            message: req.query.message,
            room_number: roomNumber,
        }
        chats.push(chat);
        fs.writeFile(`${roomNumber}.txt`, JSON.stringify(chats), function (err) {
            if (err) {
                local_rooms.push(roomNumber);
                console.log('fail to save chat! ' + err);
            }else{
                console.log('Chat Saved!');
                res.send(chats)
            }
        });
    }else{
        res.send(false);
    }
})

app.get('/add-message', (req, res) => {
    if(req.query.message != undefined && req.query.name != undefined && req.query.room_number != undefined) {
        fs.readFile(`${req.query.room_number}.txt`, function(err, data) {
            if (err){
                console.log(err);
                res.send(false);
            }else{
                console.log(data.toString());
                var chats = JSON.parse(data.toString());
                var chat = {
                    name: req.query.name,
                    message: req.query.message,
                    room_number: req.query.room_number,
                };
                chats.push(chat);
                fs.writeFile(`${req.query.room_number}.txt`, JSON.stringify(chats), function (err) {
                    if (err){
                        console.log(err);
                    }else{
                        console.log('Saved!');
                        res.send(chats);
                    }
                });
            }
        });
    }else{
        res.send(false);
    }
})

app.get('/get-messages', (req, res) => {
    if(req.query.room_number != undefined) {
        fs.readFile(`${req.query.room_number}.txt`, function(err, data) {
            if (err){
                console.log(err);
                res.send(false);
            }else{
                console.log(data.toString());
                var chats = JSON.parse(data.toString());
                res.send(chats);
            }
        });
    }else{
        res.send(false);
    }
})

app.get('/get-all-rooms', (req, res) => {
    res.send(local_rooms);
})


app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
})