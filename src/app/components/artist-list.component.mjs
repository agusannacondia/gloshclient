$('.carousel').carousel();

var slider = $('.js-slider').isystkSlider({
    'prevBtnKey': $(this).find('.prev-btn'),
    'nextBtnKey': $(this).find('.next-btn'),
    'slideCallBack': function(data) {
      slider.find('.paging li').removeClass('active');
      slider.find('.paging li:eq('+(data.pageNo-1)+')').addClass('active');
    }
});

slider.find('.paging li').click(function(e) {
  e.preventDefault();
  slider.changePage($(this).data('pageno'), $.fn.isystkSlider.ANIMATE_TYPE.SLIDE);
});
if (0 < self.find('.prev-btn').length) {
  self.find('.view-layer').css({
    'margin-left': '36px'
  });
}

$('#modalAddArtist').modal();

$('#modalAddAlbum').modal();

function displayRegister(button){
      var reg = document.getElementById("indexRegister");
      var log = document.getElementById("indexLogin");
      var posLog = 50;
      var posReg = 0;
      var opLog = 1;
      var opReg = 0;
      var id = setInterval(frame,1);
      function frame () {
      if(posLog == 0){
        clearInterval(id);
      }else{
          posLog--;
          posReg++;
          opLog -= 0.05;
          opReg += 0.05;
          log.style.left = posLog + "%";
          reg.style.left = - posReg + "%";
          log.style.opacity = opLog;
          reg.style.opacity = opReg;
      }
     }
     reg.style.zIndex = 3;
     log.style.zIndex = 2;
}

function displayLogin(button){
      var reg = document.getElementById("indexRegister");
      var log = document.getElementById("indexLogin");
      var posLog = 0;
      var posReg = 50;
      var opLog = 0;
      var opReg = 1;
      var id = setInterval(frame,1);
      function frame () {
      if(posReg == 0){
        clearInterval(id);
      }else{
          posLog++;
          posReg--;
          opLog += 0.05;
          opReg -= 0.05;
          log.style.left = posLog + "%";
          reg.style.left = - posReg + "%";
          log.style.opacity = opLog;
          reg.style.opacity = opReg;
      }
     }
     reg.style.zIndex = 2;
     log.style.zIndex = 3;
}