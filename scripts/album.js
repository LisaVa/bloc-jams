var createSongRow = function(songNumber, songName, songLength) {
  var template =
  '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

   var $row = $(template);

   var clickHandler = function() {
	    var songNumber = parseInt($(this).attr('data-song-number'));

	    if (currentlyPlayingSongNumber !== null) {
		    revertHtmlToSongNumber(currentlyPlayingSongNumber);
	    }

	    if (currentlyPlayingSongNumber !== songNumber) {
		    // Switch from Play -> Pause button to indicate new song is playing.
		    $(this).html(pauseButtonTemplate);
        setSong(songNumber);
      } else if (currentlyPlayingSongNumber === songNumber) {
		    // Switch from Pause -> Play button to pause currently playing song.
		    $(this).html(playButtonTemplate);
        pauseCurrentSong();
	    }
  };

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
      console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    }
  };

  // #1
  $row.find('.song-item-number').click(clickHandler);

  // #2
  $row.hover(onHover, offHover);

  // #3
  return $row
};


var setCurrentAlbum = function(album) {
  currentAlbum = album;

  // #1
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  // #2
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  // #3
  $albumSongList.empty();

  // #4
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }


};
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};
/*

var previousSong = function() {
  //know what the previous song is
  var previousSong = currentlyPlayingSongNumber;
  var indexOfPreviousSong = trackIndex(currentAlbum, currentSongFromAlbum);
  var indexOfNextSong = indexOfPreviousSong - 1;

  if (indexOfNextSong <= -1) {
    indexOfNextSong = currentAlbum.songs.length - 1;
  }

  //use trackIndex() helper function to get index of current song and then increment value from index
  //Set new current song to currentSongFromAlbum
  currentlyPlayingSongNumber = indexOfNextSong + 1;

  setSong(currentlyPlayingSongNumber);
  revertHtmlToSongNumber(previousSong);
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);

  //update the player bar to show new songs
  //update HTML of previous song's .song-item-number element with a songNumber
  //update the HTML of the new song's .song-item-number element with a pause button
}

var nextSong = function() {
  //know what the previous song is
  var previousSong = currentlyPlayingSongNumber;
  var indexOfPreviousSong = trackIndex(currentAlbum, currentSongFromAlbum);
  var indexOfNextSong = indexOfPreviousSong + 1;

  if (indexOfNextSong >= currentAlbum.songs.length) {
    indexOfNextSong = 0;
  }

  //use trackIndex() helper function to get index of current song and then increment value from index
  //Set new current song to currentSongFromAlbum
  currentlyPlayingSongNumber = indexOfNextSong + 1;

  setSong(currentlyPlayingSongNumber);
  revertHtmlToSongNumber(previousSong);
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);

  //update the player bar to show new songs
  //update HTML of previous song's .song-item-number element with a songNumber
  //update the HTML of the new song's .song-item-number element with a pause button
}
*/

var previousOrNextSong = function() {

  //know what the previous song is
  var currentSong = currentlyPlayingSongNumber;
  var indexOfCurrentSong = trackIndex(currentAlbum, currentSongFromAlbum);
  var indexOfNextSong = currentSong + 1;
  var indexOfPreviousSong = currentSong - 1;

  if (indexOfPreviousSong <= -1) {
    indexOfNextSong = currentAlbum.songs.length - 1;
  }

  if (indexOfNextSong >= currentAlbum.songs.length) {
    indexOfNextSong = 0;
  }

  //use trackIndex() helper function to get index of current song and then increment value from index
  //Set new current song to currentSongFromAlbum
  currentlyPlayingSongNumber = indexOfNextSong + 1;

  setSong(currentlyPlayingSongNumber);
  revertHtmlToSongNumber(currentSong);
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);

  //update the player bar to show new songs
  //update HTML of previous song's .song-item-number element with a songNumber
  //update the HTML of the new song's .song-item-number element with a pause button
}



var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};


//Album button template
var playButtonTemplate = '<a class="album-song-button"><span class= "ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;


var setSong = function(songNumber) {
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

}

var pauseCurrentSong = function() {
  $('.main-controls .play-pause').html(playerBarPlayButton);
  currentlyPlayingSongNumber = null;
  currentSongFromAlbum = null;
}

var getSongNumberCell = function(songNumber) {
  return $('.song-item-number[data-song-number="' + songNumber + '"]');
}

var revertHtmlToSongNumber = function(songNumber) {
  var elem = getSongNumberCell(songNumber);
  elem.html(songNumber);
}

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);

});
