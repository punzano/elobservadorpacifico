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
  });
}

function setActiveOption(optionHref) {
  let section_name = $(".off-canvas-options a[href=\"" + optionHref + "\"] span").text();
  $("#off-canvas-content-section-name").empty();
  $("#off-canvas-content-section-name").text(section_name);
  $("#off-canvas-options li.active").removeClass("active");
  $(".off-canvas-options a[href=\"" + optionHref + "\"]").parent().addClass("active");
  if($("#off-canvas-options li.active").parent().hasClass("nested"))
    $("#off-canvas-options li.active").parent().addClass("is-active");

  return section_name;
}

function loadCategories() {
  if($("#categories-menu").children().length === 0) {
    let ajaxRequest = new AjaxRequest({
      ajaxUri: "/categories",
      ajaxAsync: false,
      onSuccessCallback: function(retrievedData) {
        renderCategories(retrievedData);
      }
    });
    ajaxRequest.execute();
  }
}

function renderCategories(categories) {
  for(let i = 0; i < categories.length; i++) {
    $("#categories-menu").append(
      "<li><a class=\"row align-justify\" href=\"" + categories[i].url + "\">" +
        "<span class=\"columns\">" + categories[i].name + "</span>" +
        "<i class=\"columns shrink align-self-middle fa fa-caret-right\" aria-hidden=\"true\"></i>" +
      "</a></li>"
    );
  }
}

function loadLastEntries() {
  let ajaxRequest = new AjaxRequest({
    ajaxUri: "/posts",
    loadingDivID: "content-section",
    onSuccessCallback: function(retrievedData) {
      renderPostsBoxes(retrievedData);
    }
  });
  ajaxRequest.execute();
}

function loadCategoryEntries(category) {
  let ajaxRequest = new AjaxRequest({
    ajaxUri: "/posts/" + category,
    loadingDivID: "content-section",
    onSuccessCallback: function(retrievedData) {

      renderPostsBoxes(retrievedData);
    }
  });
  ajaxRequest.execute();
}

function loadHtml(htmlName) {
  let ajaxRequest = new AjaxRequest({
    ajaxUri: htmlName + ".html",
    loadingDivID: "content-section",
    dataType: 'html',
    onSuccessCallback: function(htmlCode) {
      renderHtml(htmlCode);
    }
  });
  ajaxRequest.execute();
}

function renderPostsBoxes(postsData) {
  $("#content-section-loading").remove();
  if(!$("#content-section").hasClass("row"))
    $("#content-section").addClass("row");
  let $contentDiv = $("#content-section");
  for(let i = 0; i < postsData.length; i++) {
    let entryBox =
      "<div class=\"content-column column large-3 medium-6 small-12\">" +
        "<div id=\"" + postsData[i]._id + "\" class=\"content-column-box text-center\">" +
          "<img class=\"content-column-box-img\" src=\"" + postsData[i].img + "\" alt=\"\">" +
          "<span class=\"content-column-box-title\">" + postsData[i].title + "</span>" +
        "</div>" +
        "<div class=\"content-column-subbox text-center\">" +
          "<div class=\"content-column-subbox-year\">" + getYearFromDate(postsData[i].date) + "</div>" +
          "<div class=\"content-column-subbox-month\">" + getMonthFromDate(postsData[i].date) + "</div>" +
          "<div class=\"content-column-subbox-day\">" + getDayFromDate(postsData[i].date) + "</div>" +
          "<hr/>" +
          "<div class=\"row align-spaced\"><i class=\"fa fa-comments column align-self-middle\" aria-hidden=\"true\"></i><span class=\"column align-self-middle\">" + postsData[i].comments + "</span></div>" +
          "<div class=\"row align-spaced\"><i class=\"fa fa-thumbs-up column align-self-middle\" aria-hidden=\"true\"></i><span class=\"column align-self-middle\">" + postsData[i].likes + "</span></div>" +
          "<div class=\"row align-spaced\"><i class=\"fa fa-share column align-self-middle\" aria-hidden=\"true\"></i><span class=\"column align-self-middle\">" + postsData[i].shares + "</span></div>" +
        "</div>" +
      "</div>";
    $contentDiv.append(entryBox);
  }
  setPostsBoxesEventHandlers();
}

function setPostsBoxesEventHandlers() {
  $(".content-column-box").click(function(event){
    $("#content-section").empty();
    let entryID = event.currentTarget.id;
    let entryTitle = $(event.currentTarget).find(".content-column-box-title")[0].innerText;
    page.redirect("/entrada/" + entryID);
  });
}

function renderPost(entryID) {
  let ajaxRequest = new AjaxRequest({
    ajaxUri: "/post/" + entryID,
    loadingDivID: "content-section",
    onSuccessCallback: function(retrievedData) {
      $("#content-section-loading").remove();
      $("#content-section").removeClass("row");
      $("#content-section").append(retrievedData[0].html);
    }
  });
  ajaxRequest.execute();
}

function getYearFromDate(date) {
  let dateProcessed = new Date(date);
  return dateProcessed.getFullYear();
}

function getMonthFromDate(date) {
  let dateProcessed = new Date(date);
  return dateProcessed.toLocaleString("es-sp", { month: "short" });
}

function getDayFromDate(date) {
  let dateProcessed = new Date(date);
  return dateProcessed.getDate();
}

function renderHtml(htmlCode) {
  $("#content-section").empty();
  $("#content-section").html(htmlCode);
}
