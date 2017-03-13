$(document).ready(function() {
  $(document).foundation();
  setEventHandlers();
});

function setEventHandlers() {
  $('#off-canvas-content-toggle-button, #off-canvas-menu-toggle-button').click(function () {
    $('#off-canvas-menu').toggleClass('reveal-for-large');
    $('#off-canvas-content').toggleClass('menu-hidden');
    $('#off-canvas-content-toggle-button').toggle();
  });

  $("#off-canvas-options li:not(.is-accordion-submenu-parent)").click(function(event){
    $("#off-canvas-options li.active").removeClass("active");
    $(event.currentTarget).addClass("active");
  })
}

function loadLastEntries() {
  let ajaxRequest = new AjaxRequest({
    ajaxUri: "/posts",
    loadingDivID: "off-canvas-content-entries-section",
    onSuccessCallback: function(retrievedData) {
      renderPostsBoxes(retrievedData);
    }
  });
  ajaxRequest.execute();
}

function loadCategoryEntries(category) {
  let ajaxRequest = new AjaxRequest({
    ajaxUri: "/posts" + category,
    loadingDivID: "off-canvas-content-entries-section",
    onSuccessCallback: function(retrievedData) {
      renderPostsBoxes(retrievedData);
    }
  });
  ajaxRequest.execute();
}

function renderPostsBoxes(postsData) {
  $("#off-canvas-content-entries-section-loading").remove();
  let $entriesDiv = $("#off-canvas-content-entries-section");
  for(let i = 0; i < postsData.length; i++){
    let entryBox =
      "<div class=\"off-canvas-content-entries-column column large-3\">" +
        "<div id=\"" + postsData[i]._id + "\" class=\"off-canvas-content-entries-column-box text-center\">" +
          "<img class=\"off-canvas-content-entries-column-box-img\" src=\"" + postsData[i].img + "\" alt=\"\">" +
          "<span class=\"off-canvas-content-entries-column-box-title\">" + postsData[i].title + "</span>" +
        "</div>" +
      "</div>";
    $entriesDiv.append(entryBox);
  }
}

function setPostBoxEventHandler() {
  $(".off-canvas-content-entries-column-box").click(function(event){
    $("#off-canvas-content-entries-section").empty();
    let entryID = event.currentTarget.id;
    let ajaxRequest = new AjaxRequest({
      ajaxUri: "/posts/" + entryID,
      loadingDivID: "off-canvas-content-entries-section",
      onSuccessCallback: function(retrievedData) {
        renderPost(retrievedData);
      }
    });
    ajaxRequest.execute();
  });
}

function renderPost(postData) {
  $("#off-canvas-content-entries-section-loading").remove();
  $("#off-canvas-content-entries-section").append(postData[0].html);
}
