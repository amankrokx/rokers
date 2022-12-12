// create express server with modular js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connection, insert } from './server/components/database/index.js';
import youtube from 'youtube-search-api'
import ytdl from 'ytdl-core';
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// enable cors
app.use(cors());

// define a simple route
app.get('/',async (req, res) => {
    const result = await insert('songs', {
        sid : '123',
        title : 'test',
        albumID : 1,
        lastPlayed : new Date(),
        albumArt : 'test'.toString('base64'),
        length : 123,
        playCount : 1,
        // pid : 1,
        favourite : true
    });
    res.json({"result": result});
})

// route to display all songs in html table
app.get('/songs', (req, res) => {
    connection.query('SELECT * FROM songs', (err, result) => {
        if (err) throw err;
        // create html table with data
        let html = '<table border=1|1>';
        html += '<tr>';
        for (let key in result[0]) {
            html += `<th>${key}</th>`;
        }
        html += '</tr>';
        result.forEach(row => {
            html += '<tr>';
            for (let key in row) {
                html += `<td>${row[key]}</td>`;
            }
            html += '</tr>';
        });
        html += '</table>';
        res.send(html);
    });
})

// get song by id
app.get('/song/:id', (req, res) => {
    youtube.GetListByKeyword(req.params.id, false, 10, [{type: "video"}]).then((result) => {
        ytdl.getInfo(result.items[0].id).then((info) => {
            res.json(info);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
    
    // connection.query(`SELECT * FROM songs WHERE sid = '${req.params.id}'`, (err, result) => {
    //     if (err) throw err;
    //     res.json(result);
    // });
})

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});