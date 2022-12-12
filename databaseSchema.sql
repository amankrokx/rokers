create table artists (
	artistID integer auto_increment primary key,
    artistName varchar(100) not null,
    artistImage mediumblob null,
    songCount integer default 0,
    favourite boolean default false
);

create table albums (
	alubmID integer auto_increment primary key,
    albumName varchar(100) not null,
    albumImage mediumblob null,
    songCount integer default 0,
    favourite boolean default false
);

create table playlists (
	pid integer auto_increment primary key,
    playlistName varchar(100) not null,
    favourite boolean default false,
    songCount integer default 0,
    playCount integer default 0
);

create table songs (
	sid varchar(30) primary key,
    title varchar(100) not null,
    albumID integer null references albums(albumID),
    lastPlayed timestamp,
    albumArt mediumblob null,
    length integer not null,
    playCount integer default 0,
    pid integer null references playlists(pid),
    favourite boolean default false
);

create table songArtists (
	sid varchar(30) not null,
    artistID integer not null,
    primary key(sid, artistID),
    foreign key(sid) references songs(sid),
    foreign key(artistID) references artists(artistID)
);