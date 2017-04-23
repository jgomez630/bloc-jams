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
//  $('.album-view-song-item td').each(function(){
//    console.log($(this));
//  })
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

var $albumImage = $('.album-cover-art');
  var albums = [albumPicasso,albumMarconi,albumPaganni];
  var index = 1;
  $albumImage.click(function(event){
    setCurrentAlbum(albums[index]);
    index++;
    if(index == albums.length) {
      index = 0;
     }
  });


 