import { exec } from "child_process"

class PlaybackQueue {
    constructor() {
        this.queue = []
        this.currentSongIndex = null

        this.playing = false
        this.paused = false
        this.repeat = false
        this.shuffle = false
        this.songInMemory = false
        this.child = null
        this.timeLeft = 0
        this.timer = null
    }

    addSong(song) {
        this.queue.push(song)
        if (!this.playing && !this.paused) {
            this.resumePlayback(0)
        }
    }

    removeSong(index) {
        this.queue.splice(index, 1)
        if (index === this.currentSongIndex) {
            if (this.queue.length === 0) {
                this.stopPlayback()
            } else {
                this.resumePlayback(0)
            }
        }
    }

    resumePlayback(index) {
        if (index >= this.queue.length) throw new Error("Index out of bounds")
        
        this.playing = true
        this.paused = false
        this.currentSongIndex = index

        if (this.songInMemory && this.paused) {
            this.continuePlayback()
        } else if (this.songInMemory && !this.paused) {
            // do nothing
            return
        } else {
            this.playSong(this.queue[index])
        }
    }
    
    // play song with ffplay using exec
    async playSong (url) {
        try {
            // play url with ffplay using exec
            this.child = exec(`ffplay -nodisp -autoexit -hide_banner -loglevel quiet -i "${url}"`)
            this.songInMemory = true
            this.child.on('exit', () => {
                this.songInMemory = false
                if (this.repeat) {
                    this.resumePlayback(this.currentSongIndex)
                } else if (this.currentSongIndex < this.queue.length - 1) {
                    this.resumePlayback(this.currentSongIndex + 1)
                } else {
                    this.stopPlayback()
                }
            })
            this.child.on('error', (error) => {
                throw error
            })
            return true
        } catch (error) {
            throw error
        }

    }

    continuePlayback() {
        if (this.child) {
            this.child.send('SIGCONT')
            this.playing = true
            this.paused = false
        }
        else throw new Error("No child process")
    }

    pausePlayback() {
        if (this.child) {
            this.child.send('SIGSTOP')
            this.playing = false
            this.paused = true
        }
        else throw new Error("No child process")
    }

    stopPlayback() {
        if (this.child) {
            this.queue = []
            this.child.kill()
            this.child = null
            this.playing = false
            this.paused = false
            this.currentSongIndex = null
        }
        else throw new Error("No child process")
    }


    
}

export default new PlaybackQueue()