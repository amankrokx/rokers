import fs from 'fs';
import { config } from 'dotenv';

config();

class Spotify {
    constructor(clientID, clientSecret) {
        this.clientID = clientID
        this.clientSecret = clientSecret
        // check if token file exists and read it
        if (fs.existsSync('./token.json')) {
            this.token = JSON.parse(fs.readFileSync('./token.json', 'utf8'))
            console.log("Token loaded", this.token)
            if (this.token.expires_at < Date.now())
                (async () => await this.refreshToken())()
            }
            else (async () => await this.refreshToken())()
    }

    async refreshToken() {
        return new Promise((resolve, reject) => {
            // get new token
            fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + Buffer.from(this.clientID + ":" + this.clientSecret).toString("base64"),
                },
                body: "grant_type=client_credentials",
            })
                .then(res => res.json())
                .then(data => {
                    data.expires_at = Date.now() + data.expires_in * 1000
                    this.token = data
                    fs.writeFileSync("./token.json", JSON.stringify(data))
                    console.log("Token refreshed", this.token)
                    resolve(data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    getSong(id) {
        return new Promise(async (resolve, reject) => {
            if (this.token.expires_at < Date.now())
                await this.refreshToken()
            fetch(`https://api.spotify.com/v1/tracks/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + this.token.access_token,
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    resolve(data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    /**
     * 
     * @param {string} query
     * @param {string} type
     * @param {number} limit
     * @param {number} offset
     * @returns {Promise}
     * @example
     * search("test", "track", 10, 0)
     * search("test", "track", 10)
     * search("test", "track")
     * 
     * // search for tracks
     * search("test")
     * 
     */
    searchSong({ query, types=['track'],limit = 10, offset = 0, region = "IN" }) {
        return new Promise(async (resolve, reject) => {
            if (this.token.expires_at < Date.now())
                await this.refreshToken()
            fetch(`https://api.spotify.com/v1/search?q=${query}&type=${types.join(',')}&include_external=audio&limit=${limit}&market=${region}&offset=${offset}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + this.token.access_token,
                },
            })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    }
        
}

const spotify = new Spotify(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)
export default spotify