/*Create album Object*/
var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: 1881,
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs:[
    {title: 'Blue', duration: '4:26'},
    {title: 'Green', duration: '3:14'},
    {title: 'Red', duration: '5:01'},
    {title: 'Pink', duration: '3:21'},
    {title: 'Magenta', duration: '3:15'},
  ]
};
/*Create album Object*/
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs:[
    {title: 'Hello Operator?', duration: '1:01'},
    {title: 'Ring,ring,ring?', duration: '5:01'},
    {title: 'Fits in your pocket?', duration: '3:21'},
    {title: 'Can you hear me?', duration: '3:14'},
    {title: 'Wrong phone number?', duration: '2:15'},
  ]
};
/*Create 3rd album Object*/
var albumPaganni = {
  title: 'The Trills',
  artist: 'Marconi macaroni',
  label: 'EMI',
  year: '1809',
  albumArtUrl: 'assets/images/album_covers/07.png',
  songs:[
    {title: 'Hello World?', duration: '1:01'},
    {title: 'Ring,swing,ring?', duration: '5:01'},
    {title: 'Fits like a glove?', duration: '3:21'},
    {title: 'Can you hear me?', duration: '3:14'},
    {title: 'Wrong phone number?', duration: '2:15'},
  ]
};

/*Dynamically Generate Song Row Content*/
var createSongRow = function(songNumber,songName,songLength){
  var template =
   '<tr class="album-view-song-item">'
  + '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  +' <td class="song-item-title">' + songName + '</td>'
  +' <td class="song-item-duration">' + songLength + '</td>'
  +' </tr>'
  ;
  var $row = $(template);
  
  var clickHandler = function(){
    var songNumber = $(this).attr('data-song-number');
    
    if(currentlyPlayingSong !== null){
// Revert to song number for currently playing song because user started playing new song.      
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
      currentlyPlayingCell.html(currentlyPlayingSong);
    }
    if(currentlyPlayingSong !== songNumber){
// Switch from Play -> Pause button to indicate new song is playing.
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSong = songNumber;
    } else if (currentlyPlayingSong === songNumber){
// Switch from Pause -> Play button to pause currently playing song.
      $(this).html(playButtonTemplate);
      currentlyPlayingSong = null;
    }
  };
  
  var onHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');
    
    if (songNumber !== currentlyPlayingSong){
      songNumberCell.html(playButtonTemplate);
    }                                     
  };
  var offHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');
    
    if (songNumber !== currentlyPlayingSong){
      songNumberCell.html(songNumber);
    }
  };
  
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover,offHover);
  return $row; 
};
/*function "setCurrentAlbum" called when the window loads*/
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var setCurrentAlbum = function(album){

//jQuery version: Select elements to populate with text dynamically
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  //jQuery version: Assign values to each part of the album
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src',album.albumArtUrl);

  //Clear contents of album song list
//albumSongList.innerHTML = ' ';
  $albumSongList.empty();

  //build song list from album JS object
  for (var i = 0; i < album.songs.length; i++){
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

// Play & Pause button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 // Store state of playing songs
 var currentlyPlayingSong = null;

$(document).ready(function(){
  setCurrentAlbum(albumPicasso);
});

  var albums = [albumPicasso,albumMarconi,albumPaganni];
  var index = 1;
  albumImage.addEventListener("click", function(event){
    setCurrentAlbum(albums[index]);
    index++;
    if(index == albums.length) {
      index = 0;
     }
  });


 