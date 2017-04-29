var setSong = function(songNumber){
 if (currentSoundFile) {
     currentSoundFile.stop();
 }
 currentlyPlayingSongNumber = parseInt(songNumber);
 currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  //assign a new buzz sound obj -> currentSoundFile
 currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    //buzz sound obj settings
         formats: [ 'mp3' ],
         preload: true
    });
//setVolume function call with a setting of 80
  setVolume(currentVolume);
};
//seek to parts of a song
var seek = function(time){
  if (currentSoundFile){
    currentSoundFile.setTime(time);
  }
};
//Sets the initial song volume  
  var setVolume = function(volume){
    if (currentSoundFile){
      currentSoundFile.setVolume(volume);
    }
  };

var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
};
var createSongRow = function(songNumber,songName,songLength){
  var template =
   '<tr class="album-view-song-item">'
  + '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  +' <td class="song-item-title">' + songName + '</td>'
  +' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  +' </tr>'
  ;
  var $row = $(template);

  var clickHandler = function(){
    var songNumber = parseInt($(this).attr('data-song-number'));
    
    if(currentlyPlayingSongNumber !== null){
// Revert to song number for currently playing song 
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      
      currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    if(currentlyPlayingSongNumber !== songNumber){
// Switch from Play -> Pause button to indicate new song is playing.
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
  //currentlyPlayingSongNumber = songNumber;
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({left: currentVolume + '%'});
      $(this).html(pauseButtonTemplate);

      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber){
     if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
    } else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();   
        }
    }
  };
  
  var onHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt((songNumberCell).attr('data-song-number'));
    
    if (songNumber !== currentlyPlayingSongNumber){
      songNumberCell.html(playButtonTemplate);
    }                                     
  };
  var offHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));
    
    if (songNumber !== currentlyPlayingSongNumber){
      songNumberCell.html(songNumber);
    }
    console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

  };
  
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover,offHover);
  return $row; 
};
/*function "setCurrentAlbum" called when the window loads*/
var setCurrentAlbum = function(album){
  currentAlbum = album;
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
//Update the Seek Bar while a Song Plays
var updateSeekBarWhileSongPlays = function(){
  if(currentSoundFile){
    currentSoundFile.bind('timeupdate',function(event){
      //var seekBarFillRatio = this.getTime() / this.getDuration()
       var currentTime = this.getTime();
       var songLength = this.getDuration();
       var seekBarFillRatio = currentTime / songLength;
       var $seekBar = $('.seek-control .seek-bar');
       updateSeekPercentage($seekBar,seekBarFillRatio);
      setCurrentTimeInPlayerBar(filterTimeCode(currentTime));      
    });
  }
};
//updating seek bars
var updateSeekPercentage = function($seekBar,seekBarFillRatio){
  var offsetXPercent = seekBarFillRatio *100;
  
  offsetXPercent = Math.max(0,offsetXPercent);
  offsetXPercent = Math.min(100,offsetXPercent);
  
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};
// configure seek bars
var setupSeekBars = function(){
  var $seekBars = $('.player-bar .seek-bar');
  
  $seekBars.click(function(event){
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
     if ($(this).parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
        setVolume(seekBarFillRatio * 100);   
        }
        
    updateSeekPercentage($(this),seekBarFillRatio);
  });
  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();
    
    $(document).bind('mousemove.thumb',function(event){
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;
        if ($seekBar.parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());   
          } else {
          setVolume(seekBarFillRatio);
          }
      
      updateSeekPercentage($seekBar,seekBarFillRatio);
    });
    $(document).bind('mouseup.thumb',function(){
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};
//Track the Index of the Current Song
var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
};
//nextSong function increment/decrement the index of current song
var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // we're incrementing the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
   currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
   // Update the Player Bar information
    updatePlayerBarSong();
  updateSeekBarWhileSongPlays();
  
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
//previousSong
var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1)
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    // Update the Player Bar information
    updatePlayerBarSong();
    updateSeekBarWhileSongPlays();
  $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function(){
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

// Play & Pause button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//stores current song & album information
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

var togglePlayFromPlayerBar = function(){
 if(currentlyPlayingSongNumber === null){
   setSong(1);
   updatePlayerBarSong();
   updateSeekBarWhileSongPlays();
 }
  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
   if (currentSoundFile.isPaused()) {
        currentlyPlayingCell.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
  }else{
    currentlyPlayingCell.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
  }    
};
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      $playPause.trigger('click');  
    }else if(e.keyCode == 37){
      $previousButton.trigger('click');
    }else if(e.keyCode == 39){
      $nextButton.trigger('click');
    }
}
var setCurrentTimeInPlayerBar = function(currentTime) {
  var $currentTimeElement = $('.seek-control .current-time');
  $currentTimeElement.text(currentTime); 
 };
var setTotalTimeInPlayerBar = function(totalTime) { 
  var $totalTimeElement = $('.seek-control .total-time');
  $totalTimeElement.text(totalTime); 
 };
var filterTimeCode = function(timeInSeconds) {
  var seconds = Number.parseFloat(timeInSeconds);
  var wholeSeconds = Math.floor(seconds);
  var minutes = Math.floor(wholeSeconds / 60);
  var remainingSeconds = wholeSeconds % 60;
  var output = minutes + ':';
     
  if (remainingSeconds < 10) {
      output += '0';   
   }
  output += remainingSeconds;
  return output;
 };
$(document).ready(function(){
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPause.click(togglePlayFromPlayerBar);
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


 