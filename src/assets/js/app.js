
$(document).ready(function () {
  $(document).foundation();
//   $('#offCanvasLeft').foundation('open');
  setEventHandlers();
});

function setEventHandlers () {
  $('#off-canvas-content-toggle-button, #off-canvas-menu-toggle-button').click(function () {
    $('#off-canvas-menu').toggleClass('reveal-for-large');
    $('#off-canvas-content').toggleClass('menu-hidden');
    $('#off-canvas-content-toggle-button').toggle();
  });

//   $('#off-canvas-menu').click(function(event){
//     event.stopPropagation();
// });
}
