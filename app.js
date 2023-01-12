// create express server with modular js
import { exec } from 'child_process';
import express from 'express';
import bodyParser from 'body-parser';
import { connection, insert, query } from './server/database/index.js';
import { config } from "dotenv"
import spotify from './server/spotify/index.js';
import queue from './server/components/queue/index.js';
import featuredArtist from './server/components/featuredArtist/index.js';

config()
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// enable cors
app.use((req, res, next) => {
    res.header("Access-Control-Max-Age", "86400")
    res.header("Access-Control-Allow-Origin", req.headers.origin) // restrict it to the required domain
    // res.header("Access-Control-Allow-Origin", origins) // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET,POST")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})
// serve static files from /dist
app.use(express.static('dist'))


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

app.post('/play', async (req, res) => {
    try {
        // inxert song into database
        // get youtube id
        const track = req.body.track

        // query from songs table to see if song exists
        // if it does, update playCount
        // if it doesn't, insert into songs table
        let id
        const song = await query(`SELECT * FROM songs WHERE sid = '${track.id}'`)
        console.log(song)
        if (song.length > 0) {
            // update playCount in songs table, update lastPlayed 
            await query(`UPDATE songs SET playCount = playCount + 1 WHERE sid = '${track.id}'`)
        } else {
            id = await spotify.getSongYoutube(track)
            console.log(id)
            await insert('songs', {  
                sid : req.body.track.id,
                vid : id,
                name : req.body.track.name,
                albumID : req.body.track.album.id,
                lastPlayed : new Date(),
                albumArt : req.body.track.album.images[0].url,
                length : req.body.track.duration_ms,
                playCount : 1,
                // pid : 1,
                favourite : false
            });
            // Populate artists table
            req.body.track.artists.forEach(async artist => {
                // query from artists table to see if artist exists
                // if it does, update songCount
                // if it doesn't, insert into artists table
                const artistQuery = await query(`SELECT * FROM artists WHERE artistID = '${artist.id}'`)
                if (artistQuery.length > 0) {
                    await query(`UPDATE artists SET songCount = songCount + 1 WHERE artistID = '${artist.id}'`)
                } else {
                    await insert("artists", {
                        artistID: artist.id,
                        artistName: artist.name,
                        songCount: 1,
                        favourite: false,
                    })
                }
                await insert('songArtists', {
                    sid : req.body.track.id,
                    artistID : artist.id
                })
            })
            // Populate albums table    
            // query from albums table to see if album exists
            // if it does, update songCount
            // if it doesn't, insert into albums table
            const album = await query(`SELECT * FROM albums WHERE albumID = '${req.body.track.album.id}'`)
            if (album.length > 0) {
                await query(`UPDATE albums SET songCount = songCount + 1 WHERE albumID = '${req.body.track.album.id}'`)
            } else {
                await insert("albums", {
                    albumID: req.body.track.album.id,
                    albumName: req.body.track.album.name,
                    albumImage: req.body.track.album.images[0].url,
                    songCount: 1,
                    favourite: false,
                })
            }
        }
        console.log(song.length)
        res.json({id})
        const buffer = await spotify.getSongYoutubeBuffer((song.length > 0) ? song[0].vid : id)
        queue.addSong(buffer)
    } catch (error) {
        res.json({error})
        throw error
    }

})

// return array of albums on GET request
app.get('/albums', async (req, res) => {
    // get albums from database, find songs in each album and their artists
    let albums = await query("SELECT * FROM albums order by favourite desc")
    res.json(albums)
})

// route to display all songs in html table
app.get('/songs', (req, res) => {
    connection.query("SELECT * FROM songs inner join albums on songs.albumID = albums.albumID;", (err, result) => {
        if (err) throw err
        // create html table with data
        let html = "<table border=1|1>"
        html += "<tr>"
        for (let key in result[0]) {
            html += `<th>${key}</th>`
        }
        html += "</tr>"
        result.forEach(row => {
            html += "<tr>"
            for (let key in row) {
                html += `<td>${row[key]}</td>`
            }
            html += "</tr>"
        })
        html += "</table>"
        res.send(html)
    })
})

// get song by id
app.get('/search/:query', (req, res) => {
    spotify.searchSong({
        query : req.params.query,
        limit : 10,
        offset : 0,
        type : 'track',
    }).then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
    
    // connection.query(`SELECT * FROM songs WHERE sid = '${req.params.id}'`, (err, result) => {
    //     if (err) throw err;
    //     res.json(result);
    // });
})

// get featured artist name and album art
app.get('/featuredArtist', featuredArtist)

app.get('/playPause/:s', (req,res) => {
    if (req.params.s == 'play') queue.resumePlayback()
    else if (req.params.s == 'pause') queue.pausePlayback()
    else if (req.params.s == 'next') queue.playNext()
    else if (req.params.s == 'prev') queue.prevSong()
    else if (req.params.s == 'repeat') queue.repeatKro()
    else if (req.params.s == 'stop') queue.stopPlayback()
    else 
    res.json({status : queue.playing})
})

app.get("/featuredArtistSongs/:id", async (req, res) => {
    // get song details from artistID
    try {
        const artistID = req.params.id
        console.log(artistID)
        connection.query(`select * from songs join songArtists on songs.sid = songArtists.sid where songArtists.artistID = '${artistID}';`, (err, result) => {
            if (err) throw err
            console.log(result)
            res.json(result)
        })
        
    } catch (error) {
        res.json(error)
    }
})

app.get("/recentlyPlayed/:limit/:offset", async (req, res) => {
    // get recently played songs by limit and offset

    try {
        const limit = req.params.limit
        const offset = req.params.offset
        console.log(limit, offset)

        const songs = await query(`select * from songs join albums on songs.albumID = albums.albumID order by lastPlayed desc limit ${limit} offset ${offset};`)
        res.json(songs)
    } catch (error) {
        res.json({error})
    }
})

app.get("/favouriteSongs/:limit/:offset", async (req, res) => {
    // get favourite songs by limit and offset

    try {
        const limit = req.params.limit
        const offset = req.params.offset
        console.log(limit, offset)

        const songs = await query(`select * from songs join albums on songs.albumID = albums.albumID where favourite = true order by lastPlayed desc limit ${limit} offset ${offset};`)
        res.json(songs)
    } catch (error) {
        res.json({error})
    }
})

app.get("/syncPlayer", async (req, res) => {
    // sync player with queue
    try {
        res.json({
            playing : queue.playing,
            repeat : queue.repeat,
            song : queue.queue[queue.currentSongIndex],
            volume : queue.volume,
        })
    } catch (error) {
        res.json({error})
    }
})

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
    // run ngrok
    const ngrok = exec('ngrok http 3000')
    ngrok.stdout.on('data', (data) => {
        console.log(data)
    })
    const interval = setInterval(() => {
        if (ngrok.pid) {
            fetch("http://127.0.0.1:4040/api/tunnels", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data.tunnels[0].public_url)
                    const body = new FormData()
                    body.append("url", data.tunnels[0].public_url)
                    console.log(body)
                    fetch("https://rokerss.000webhostapp.com/", {
                        method: "POST",
                        body
                    })
                        .then(res => res.text())
                        .then(data => {
                            console.log(data)
                            clearInterval(interval)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, 2000)


});