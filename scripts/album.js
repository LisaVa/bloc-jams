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

        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});

        updatePlayerBarSong();
      } else if (currentlyPlayingSongNumber === songNumber) {
        if (currentSoundFile.isPaused()) {
  		    // Switch from Pause -> Play button to pause currently playing song.
  		    $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
          updateSeekBarWhileSongPlays()
  	    } else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
        }
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

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    // #10
    currentSoundFile.bind('timeupdate', function(event) {
      // #11
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
   var offsetXPercent = seekBarFillRatio * 100;
   // #1
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);

   // #2
   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
};

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playButton = $('.main-controls .play-pause');

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

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
  currentSoundFile.play();
  updateSeekBarWhileSongPlays()

  setSong(currentlyPlayingSongNumber);
  revertHtmlToSongNumber(previousSong);
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  $('.main-controls .play-pause').html(playerBarPauseButton);

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
  currentSoundFile.play();
  updateSeekBarWhileSongPlays()

  setSong(currentlyPlayingSongNumber);
  revertHtmlToSongNumber(previousSong);
  getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  //update the player bar to show new songs
  //update HTML of previous song's .song-item-number element with a songNumber
  //update the HTML of the new song's .song-item-number element with a pause button
}

var togglePlayFromPlayerBar = function() {
  if (currentSoundFile.isPaused()) {
    // Switch from Pause -> Play button to pause currently playing song.
    $('.main-controls .play-pause').html(playerBarPauseButton);
    currentSoundFile.play();
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
  } else {
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentSoundFile.pause();
    getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
  }
};


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
var currentSoundFile = null;
var currentVolume = 80;

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });
  currentSoundFile.play();
  setVolume(currentVolume);
};

var getSongNumberCell = function(songNumber) {
  return $('.song-item-number[data-song-number="' + songNumber + '"]');
}

var revertHtmlToSongNumber = function(songNumber) {
  var elem = getSongNumberCell(songNumber);
  elem.html(songNumber);
}

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
      var offsetX = event.pageX - $(this).offset().left;
      var barWidth = $(this).width();
      var seekBarFillRatio = offsetX / barWidth;

      if ($(this).parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
          setVolume(seekBarFillRatio * 100);
        }
      updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {
      // #8
      var $seekBar = $(this).parent();

      $(document).bind('mousemove.thumb', function(event){
        var offsetX = event.pageX - $seekBar.offset().left;
        var barWidth = $seekBar.width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($seekBar.parent().attr('class') == 'seek-control') {
          seek(seekBarFillRatio * currentSoundFile.getDuration());
           } else {
               setVolume(seekBarFillRatio);
           }

        updateSeekPercentage($seekBar, seekBarFillRatio);
      /*
      var $seekBar = $(this).parent();

      // #9
      $(document).bind('mousemove.thumb', function(event){
        var offsetX = event.pageX - $seekBar.offset().left;
        var barWidth = $seekBar.width();
        var seekBarFillRatio = offsetX / barWidth;

        updateSeekPercentage($seekBar, seekBarFillRatio);
      });

      // #10
      $(document).bind('mouseup.thumb', function() {
        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');
      });
    });
    */
    });
  });
};


$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playButton.click(togglePlayFromPlayerBar);
})
