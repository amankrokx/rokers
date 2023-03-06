sudo nano /etc/rc.local
alsamixer
omxplayer '/home/pi/Tere Naina.wav' -o alsa:hw:1

ssh pi@192.168.137.163
// password - raspberry

vlc --rc-host 127.0.0.1:8088 --alsa-audio-device hw:1,0
cd rokers
node app.js