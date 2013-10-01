/* global UT:true, $:true */
UT.Expression.ready(function(post) {
  "use strict";

  post.note = "#minions";

  var image               = $('.post-background'),
      panel               = $('.sticker-panel'),
      addStickerButton    = $('.button-add-sticker'),
      stickersCollection  = post.storage.stickers || [],
      stickersCount       = 0,
      loader              = UT.preloader.waitFor([
        "image",
        "minion1",
        "minion2",
        "minion3",
        "minion4",
        "minion5",
        "minion6",
        "minion7"
      ], false),
      valid, hasGif;

  loader.on('load', function(){
    post.size(image.outerHeight(),function() {
      post.display();
    });
  });

  loader.readyImage('minion1','images/1.png');
  loader.readyImage('minion2','images/2.png');
  loader.readyImage('minion3','images/3.png');
  loader.readyImage('minion4','images/4.png');
  loader.readyImage('minion5','images/5.png');
  loader.readyImage('minion6','images/6.png');
  loader.readyImage('minion7','images/7.png');


  function validates(){
    valid = (stickersCount > 0 && !!image.utImage("data"));
    post.valid(valid);

    if(post.isStatic) {
      hasGif = image.utImage("data") && image.utImage("data").url && image.utImage("data").url.match(/(\.gif$|\:data\/gif)/i);
      post.isStatic(!hasGif);
    }
  }

  function enableScene(){
     $('.sticker-minion').utSticker('show');
     addStickerButton.removeClass('is-hidden');
  }

  function disableScene(){
    $('.sticker-minion').utSticker('hide');
    addStickerButton.addClass('is-hidden');
  }

  function closePanel(e){
    if (e) {
      e.preventDefault();
    }
    image.utImage('update', {editable: true});
    panel.hide();
    enableScene();
  }

  function openPanel(e){
    if (e) {
      e.preventDefault();
    }
    image.utImage('update', {editable: false});
    panel.show();
    panel.css('margin-top',-panel.height()/2);
    disableScene();
  }

  function addSticker(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var stickerId = UT.uuid(),
        stickerData = {
          stickerId: stickerId,
          name:   $(event.target).data('minion'),
          width:  $(event.target).data('width'),
          height: $(event.target).data('height')
        };

    drawSticker(stickerData).utSticker('focus');
    closePanel();
    stickersCollection.push(stickerData);
    post.storage.stickers = stickersCollection;
    post.save();
    stickersCount++;
    validates();
  }

  function drawSticker(data) {
    return $('<img class="sticker-minion" src="images/'+data.name+'.png"/>')
      .appendTo(image)
      .utSticker({
        id: data.stickerId,
        styles:{
          autoflip: false,
          pos: {
            width: data.width,
            height: data.height
          },
          parentIndent: 0,
          selfOutdent: "70%"
        }
      })
      .on('utSticker:destroy', function(){
        $.each(stickersCollection, function(idx){
          if(this.stickerId === data.stickerId){
            stickersCollection.splice(idx, 1);
            stickersCount--;
            validates();
            return;
          }
        });
        post.storage.stickers = stickersCollection;
        post.save();
      });
  }

  image.utImage()
    .on('utImage:ready',function(e, data) {
      e.preventDefault();
      if(!data.data) {
        if(!post.context.mediaFirst) {
          $(this).utImage('dialog', {forceQuit:true});
        }
      }
    })
    .on('utImage:resize', function() {
      if (stickersCollection.length === 0) {
        openPanel();
      }
    })
    .on('utImage:mediaReady',function() {
      validates();
      loader.ready('image');
      image.find(".ut-sticker").utSticker('update');
    })
    .on('utImage:mediaRemove',function() {
      validates();
    });

  addStickerButton.on('click',openPanel);
  $('.button-minion').on('click', addSticker);
  $('.close-button').on('click',closePanel);

  $.each(stickersCollection, function(){
    drawSticker(this);
    stickersCount++;
    validates();
  });

});
