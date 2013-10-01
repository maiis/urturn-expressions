/* global UT:true, $:true */

UT.Expression.ready(function(post) {
  "use strict";

  var image = $('.post-background'),
      loader = UT.preloader.waitFor(["image"], false);

  loader.on('load', function() {
    post.size(image.outerHeight(), function() {
      image.find(".ut-sticker").utSticker("update");
      $.each(post.storage.stickers, function() {
        drawSticker(this);
      });
      post.display();
    });
  });

  function drawSticker(data){
    $('<img class="sticker-minion" src="images/'+data.name+'.png"/>')
      .appendTo(post.node)
      .utSticker({ id: data.stickerId });
  }

  image.utImage()
    .on('utImage:mediaReady', function(){
      loader.ready('image');
    });
});