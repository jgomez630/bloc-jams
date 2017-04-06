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
  +' <td class="song-item-number">' + songNumber + '</td>'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  +' <td class="song-item-title">' + songName + '</td>'
  +' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;
  return template;
};
//Select elements to populate with text dynamically
  var albumTitle = document.getElementsByClassName('album-view-title')[0]; 
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
/*function "setCurrentAlbum" called when the window loads*/

var setCurrentAlbum = function(album){
   //Assign values to each part of the album
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src',album.albumArtUrl);

  /*Change the Song Number to the Pause Button*/  
  var findParentByClassName = function(element, targetClass) {
    if (element) {
        var xxcurrentParent = element.parentElement;
        while (currentParent.className !== targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};
/*getSongItem() Method*/
  var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};  
  //Clear contents of album song list
  albumSongList.innerHTML = ' ';
  
  //build song list from album JS object
  for (var i = 0; i < album.songs.length; i++){
    albumSongList.innerHTML += createSongRow(i+ 1, album.songs[i].title,album.songs[i].duration);
  }
};

//Event listener album toggle
//stores the DOM element for the eventListener
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function() {
  setCurrentAlbum(albumPicasso);


songListContainer.addEventListener('mouseover',function(event){
  if(event.target.parentElement.className === 'album-view-song-item'){
    // Change the content from the number to the play button's HTML
    event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
  }
});
  
     for (var i = 0; i < songRows.length; i++) {
       songRows[i].addEventListener('mouseleave', function(event) {
             // Revert the content back to the number
          // Selects first child element, which is the song-item-number element
             this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
     });
   }

  var albums = [albumPicasso,albumMarconi,albumPaganni];
  var index = 1;
  albumImage.addEventListener("click", function(event){
    setCurrentAlbum(albums[index]);
    index++;
    if(index == albums.length) {
      index = 0;
     }
  });
};



