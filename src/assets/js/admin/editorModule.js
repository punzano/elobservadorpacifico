let EditorModule = function(attributes) {
  let categories = null;
  let initialized = false;
  let context = this;

  let categories_ajax_request = new AjaxRequest({
    ajaxUri: "/categories",
    // loadingDivID: "content-section",
    ajaxType: 'GET',
    ajaxAsync: false,
    onSuccessCallback: function(retrievedData) {
      categories = retrievedData;
    }
  });

  let get_post_ajax_request = new AjaxRequest({
    loadingDivID: "content-section",
    onSuccessCallback: function(retrievedData) {
      categories = retrievedData[0].categories;
      renderEditorScreen(retrievedData);
    }
  });

  let save_post_ajax_request = new AjaxRequest({
    ajaxUri: "/savePost",
    loadingDivID: "content-section",
    ajaxType: 'PUT',
    onSuccessCallback: function(retrievedData) {
      $("#content-section").empty();
      page.redirect("/home");
    }
  });

  let save_category_ajax_request = new AjaxRequest({
    ajaxUri: "/saveCategory",
    // loadingDivID: "content-section",
    ajaxType: 'PUT',
    onSuccessCallback: function(retrievedData) {
      categories_ajax_request.execute();
      renderCategoriesSection();
    }
  });

  this.init = function(postId) {
    setModalEventHandler();
    if(postId) {
      get_post_ajax_request.setConfigProperty("ajaxUri", "/post/" + postId);
      get_post_ajax_request.execute();
    } else {
      renderEditorScreen();
    }

    initialized = true;
  }

  this.reload = function(postId) {
    context.init(postId);
  }

  this.isInitialized = function() {
    return initialized;
  }

  function setModalEventHandler() {
    $("#continueButton").unbind('click').click(function(event) {
      let $modal = $(event.currentTarget).parent().parent();
      $modal.removeClass("save-post");
      savePost();
    });
  }

  function renderEditorScreen(postData) {
    $("#content-section").empty();
    renderInputsAndButtons(postData);
    renderEditor(postData);
  }

  function renderInputsAndButtons(postData) {
    categories_ajax_request.execute();
    $("#content-section").html(
      "<div id=\"form-and-button\" class=\"inputs-and-buttons row align-justify align-bottom\"></div>"
    );

    renderCategoriesSection();

    renderInputTitle(postData);

    renderSaveAndCancelButton();
  }

  function renderCategoriesSection() {
    if($("#categories-section").length === 0)
      $("#form-and-button").append("<div id=\"categories-section\" class=\"categories-section column large-3 row\"></div>");
    else
      $("#categories-section").empty();

    renderDropdownCategories();
    renderAddCategory();
    setCategoriesEventHandlers();
  }

  function renderDropdownCategories() {
    let dropdownButton =
      "<button class=\"categories-dropdown-button button column\" type=\"button\" data-toggle=\"categories-dropdown\">" +
        "<span>Categorías</span><i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>" +
      "</button>";

    let dropdown =
      "<div id=\"categories-dropdown\" class=\"categories-dropdown-options dropdown-pane bottom left column\" data-dropdown data-auto-focus=\"true\">" +
        "<ul class=\"vertical menu\">";
    for(let i = 0; i < categories.length; i++) {
      dropdown += "<li" + (i === categories.length - 1 ? " class=\"last\"" : "") + ">" + categories[i].name + "</li>";
    }
    dropdown += "</ul></div>";

    $("#categories-section").append("<div id=\"categories-selector\" class=\"categories-selector column large-6 row\"></div>");
    $("#categories-selector").append(dropdownButton);
    $("#categories-selector").append(dropdown);

    for(let i = 0; i < categories.length; i++) {
      $("#categories-section #categories-dropdown li:contains(" + categories[i].name + ")").addClass("is-active");
    }

    $("#categories-section").foundation();
  }

  function renderAddCategory() {
    $("#categories-section").append(
      "<div id=\"addCategory\" class=\"add-categories-button button column large-5 row align-middle align-center\">" +
        "<span>Añadir categoría</span>" +
        "<i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i>" +
      "</div>"
    );
  }

  function setCategoriesEventHandlers() {
    $("#categories-dropdown li").unbind("click").click(function(event) {
      if($(event.currentTarget).hasClass("is-active"))
        $(event.currentTarget).removeClass("is-active");
      else
        $(event.currentTarget).addClass("is-active");
    });

    $("#categories-section #addCategory").unbind("click").click(function(event) {
      $("#categories-section").foundation();
      $('#addCategoryModal').foundation('open');
    });

    $("#add-category-modal-save-button").unbind("click").click(function(event) {
      let category = $("#addCategoryModal #addCategoryModalTextName")[0].value;
      let category_url = category.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ").replace(/  +/g, ' ').toLowerCase().replace(/ /g, "-");
      if(category_url.substr(category_url.length - 1) === "-")
          category_url = category_url.slice(0, -1);
      category_url = normalize(category_url);
      save_category_ajax_request.setConfigProperty("data", {category: category, category_url: "/" + category_url});
      $("#addCategoryModal #addCategoryModalTextName").val("");
      save_category_ajax_request.execute();
    });
  }

  function renderInputTitle(postData) {
    $("#content-section #form-and-button").append(
      "<label class=\"input column large-2\">" +
        "Título" +
        "<input id=\"title\" type=\"text\" " + (postData ? ("value=\"" + postData[0].title + "\"") : ("placeholder=\"Escribe aquí la categoría de la entrada\"")) + ">" +
      "</label>"
    );
  }

  function renderSaveAndCancelButton() {
    $("#content-section #form-and-button").append(
      "<div id=\"saveAndCancelWrapper\" class=\"save-and-cancel-wrapper\">" +
        "<div id=\"saveEntry\" class=\"button save-button\">" +
          "<span>Guardar </span>" +
          "<i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i>" +
        "</div>" +
        "<div id=\"cancelButton\" class=\"button\">" +
          "<span>Cancelar </span>" +
          "<i class=\"fa fa-times-circle\" aria-hidden=\"true\"></i>" +
        "</div>" +
      "</div>"
    );

    setSaveAndCancelEventHandlers();
  }

  function setSaveAndCancelEventHandlers() {
    $("#saveEntry").click(function(event) {
      $('#confirmationModal #confirmationModalText').text("¿Estás seguro de que quieres guardar esta entrada?");
      if($('#confirmationModal').hasClass("delete-post"))
        $('#confirmationModal').removeClass("delete-post");
      $('#confirmationModal').addClass("save-post");

      $("#form-and-button").foundation();
      $('#confirmationModal').foundation('open');
    });

    $("#cancelButton").click(function(event) {
      page.redirect("/home");
    });
  }

  function renderEditor(postData) {
    $("#content-section").append("<div id=\"wysiwyg-section\"></div>");

    $.trumbowyg.svgPath = '/assets/fonts/icons.svg';
    $('#wysiwyg-section').trumbowyg({
      btnsDef: {
        // Customizables dropdowns
        image: {
          dropdown: ['insertImage', 'upload', 'noembed'],
          ico: 'insertImage'
        }
      },
      btns: [
        ['viewHTML'],
        ['undo', 'redo'],
        ['formatting'],
        'btnGrp-design',
        ['link'],
        ['image'],
        'btnGrp-justify',
        'btnGrp-lists',
        ['foreColor', 'backColor'],
        ['table'],
        ['horizontalRule'],
        ['fullscreen']
      ],
      plugins: {
        // Add imagur parameters to upload plugin
        upload: {
          serverPath: '/saveImage ',
          fileFieldName: 'image',
          success: function(data, trumbowyg, $modal, values) {
            // var url = getDeep(data, trumbowyg.o.plugins.upload.urlPropertyName.split('.'));
            trumbowyg.execCmd('insertImage', data.filePath);
            // $('img[src="' + data.filePath + '"]:not([alt])', trumbowyg.$box).attr('height', 100);
            // $('img[src="' + data.filePath + '"]:not([alt])', trumbowyg.$box).attr('width', 100);
            trumbowyg.closeModal();
            trumbowyg.$c.trigger('tbwuploadsuccess', [trumbowyg, data, data.filePath]);
          }
        }
      }
    });

    if(postData)
      $("#content-section #wysiwyg-section").html(postData[0].html);
  }

  function savePost() {
    let categories = $("#content-section #form-and-button #categories-dropdown li.is-active").map(function(){
       return $.trim($(this).text());
    }).get();
    let title = $("#content-section #title")[0].value;

    let postImage;
    if($("#content-section #wysiwyg-section iframe").length > 0) {
      let youtubeIframeSrc = $("#content-section #wysiwyg-section iframe").attr("src");
      let youtubeIframeSrcParts = youtubeIframeSrc.split("/");
      let youtubeVideoId = youtubeIframeSrcParts[youtubeIframeSrcParts.length - 1].split("?")[0];
      postImage = "http://img.youtube.com/vi/" + youtubeVideoId + "/0.jpg";
    }
    else {
      postImage = $("#content-section #wysiwyg-section img").attr("src");
    }

    let entryCode = $("#content-section #wysiwyg-section").html();

    let urlParts = window.location.href.split("/");
    let entryId = urlParts[urlParts.length - 1] !== "create" ? urlParts[urlParts.length - 1] : null;

    save_post_ajax_request.setConfigProperty("data", {
      img: postImage,
      date: new Date().toDateString(),
      title: title,
      categories: categories,
      html: entryCode,
      id: entryId
    });
    save_post_ajax_request.execute();
  }
}
