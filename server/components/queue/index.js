import Player from "vlc-remote"
import { initializeApp } from "firebase/app"
import { ref, getDatabase, update, set } from "firebase/database"
import spotify from "../../spotify/index.js"

const firebaseConfig = {
    apiKey: "AIzaSyA1_F1pROIduw6oLTxIUpyypPS3iciASk4",
    authDomain: "rokers-88dad.firebaseapp.com",
    projectId: "rokers-88dad",
    storageBucket: "rokers-88dad.appspot.com",
    messagingSenderId: "472240287143",
    appId: "1:472240287143:web:edf03ee0c37093d27a5a82",
    databaseURL: "https://rokers-88dad-default-rtdb.asia-southeast1.firebasedatabase.app",
}
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

class PlaybackQueue {
    constructor() {
        this.vlc = new Player({port : 8088,host : "127.0.0.1"})
        this.queue = new Array()
        this.db = db
        this.playing = false
        this.ref = ref(this.db, "player")
        this.vlc.start().then(() => {
            console.log("VLC Started")
            update(this.ref, {
                online: true,
                playing: false,
            })

            this.vlc.on("error", (error) => {
                update(this.ref, {
                    online: false,
                    playing: false,
                })
                console.log(error)
            })

            this.vlc.on("state", (state) => {
                console.log("state------------------",state)
            })

            this.vlc.on("play", (path) => {
                // add to realtime database using firebase-admin
                set(this.ref, {
                    playing: true,
                    online: true,
                    added: Date.now(),
                    song: this.queue[0],
                })
                this.playing = true
                console.log("Playing--------------------" )
            })
        })

    }

    async addToQueue (url, track) {
        if (!Object.hasOwnProperty.call(track, "duration_ms")) {
            track = (await spotify.spotifyApi.getTrack(track.id)).body
        }
        track.download = url
        this.queue.push(track)
        await this.vlc.enqueue(url)
        await this.vlc.toggle_play()
    }

    pause () {
        this.playing = !this.playing
        update(this.ref, {
            playing: this.playing,
            online: true,
        })
        this.vlc.pause()
    }


    
}

export default new PlaybackQueue()