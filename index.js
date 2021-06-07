process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
var request = require('request');
const cors = require('cors');
const ejs = require('ejs');
var fs = require('fs');
const app = express();
app.use(cors(), express.static( "public" ) );
app.set('view engine', 'ejs');
const port = process.env.PORT || 3001;

var local_rooms = [];
async function get_all_rooms(){
    fs.readdir(`./`, function (err, data) {
        if (err) {
            console.log('fail to save chat! ' + err);
        }else{
            console.log(data);
        }
    }
}
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


app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
})