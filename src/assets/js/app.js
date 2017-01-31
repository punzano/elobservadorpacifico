
$(document).ready(function() {
  $(document).foundation();
//   $('#offCanvasLeft').foundation('open');
  setEventHandlers();
});

function setEventHandlers(){
  $('#off-canvas-toggle-button').click(function(){
    $('#offCanvasLeft').toggleClass('reveal-for-large');
  });
}
