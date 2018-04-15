let HomeModule = function(attributes) {
  let categories_selected;
  let categories_on_open;
  let dates_on_open = new Object();
  let dates_selected = {
    min: null,
    max: null
  };

  let initialized = false;

  let context = this;

  let entries_ajax_request = new AjaxRequest({
    ajaxUri: "/posts",
    onSuccessCallback: function(retrievedData) {
      renderHome(retrievedData);
    },
    onErrorCallback: function() {
      showNoEntriesText();
    }
  });

  let get_categories_ajax_request = new AjaxRequest({
    ajaxUri: "/categories",
    ajaxType: 'GET',
    ajaxAsync: false,
    onSuccessCallback: function(retrievedData) {
      renderCategoriesFilter(retrievedData);
    }
  });

  let get_dates_ajax_request = new AjaxRequest({
    ajaxUri: "/dates",
    ajaxType: 'GET',
    ajaxAsync: false,
    onSuccessCallback: function(retrievedData) {
      dates_on_open = retrievedData[0];
      renderDatesFilter(retrievedData[0]);
    }
  });

  let delete_post_ajax_request = new AjaxRequest({
    ajaxUri: "/deletePost",
    ajaxType: 'DELETE',
    onSuccessCallback: function(retrievedData) {
      page.redirect("/home");
    }
  });

  this.init = function() {
    setModalEventHandler();
    renderDivs();
    $("#table-section").html("<div id=\"table-section-loading\" class=\"table-section-loading row align-center\"><img class=\"align-self-middle\" src=\"assets/img/loading.gif\"></div>");
    entries_ajax_request.execute();
    renderFiltersAndButtons();
    initialized = true;
  }

  this.reload = function() {
    entries_ajax_request.setConfigProperty("data", {categories: categories_selected, dates: dates_selected});
    $("#table-section").html("<div id=\"table-section-loading\" class=\"table-section-loading row align-center\"><img class=\"align-self-middle\" src=\"assets/img/loading.gif\"></div>");
    entries_ajax_request.execute();
  }

  this.isInitialized = function() {
    return initialized;
  }

  function setModalEventHandler() {
    $("#continueButton").unbind('click').click(function(event) {
      let $modal = $(event.currentTarget).parent().parent();
      $modal.removeClass("delete-post");
      deletePost(event);
    });
  }

  function renderDivs() {
    $("#content-section").html(
      "<div id=\"form-and-button\" class=\"inputs-and-buttons row align-justify align-bottom\"></div>" +
      "<div id=\"table-section\" class=\"table-section\"></div>"
    );
  }

  function renderHome(postsData) {
    renderTable(postsData);

    $("#table-section-loading").remove();
  }

  function renderFiltersAndButtons() {
    retrieveCategories();
    retrieveDates();
    renderAddEntryButton();
  }

  function retrieveCategories() {
    get_categories_ajax_request.execute();
  }

  function renderCategoriesFilter(categories) {
    if(categories.length > 0) {
      let dropdownButton =
        "<button class=\"categories-dropdown-button button column large-2\" type=\"button\" data-toggle=\"categories-dropdown\">" +
          "<span>Categorías</span><i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>" +
        "</button>";

      let dropdown = "<div id=\"categories-dropdown\" class=\"categories-dropdown-options dropdown-pane\" data-dropdown data-auto-focus=\"true\"><ul class=\"vertical menu\">";
      for(let i = 0; i < categories.length; i++) {
        dropdown += "<li class=\"" + (($.inArray(categories[i].name, categories_selected) != -1  || !categories_selected) ? "is-active" : "") + (i === categories.length - 1 ? " last" : "") + "\">" +
          categories[i].name + "</li>";
      }
      dropdown += "</ul></div>";

      $("#content-section #form-and-button").append(dropdownButton);
      $("#content-section #form-and-button").append(dropdown);

      $(document).foundation();

      setCategoriesFilterEventHandlers();
    }
  }

  function setCategoriesFilterEventHandlers() {
    $("#content-section #form-and-button #categories-dropdown li").click(function(event) {
      if($(event.currentTarget).hasClass("is-active"))
        $(event.currentTarget).removeClass("is-active");
      else
        $(event.currentTarget).addClass("is-active");
    });

    $("#content-section #form-and-button #categories-dropdown").on('hide.zf.dropdown', function () {
      categories_selected = $("#content-section #form-and-button #categories-dropdown li.is-active").map(function(){
         return $.trim($(this).text());
      }).get();

      if(categories_selected.toString() !== categories_on_open.toString())
        context.reload();
    });

    $("#content-section #form-and-button #categories-dropdown").on('show.zf.dropdown', function () {
      categories_on_open = $("#content-section #form-and-button #categories-dropdown li.is-active").map(function(){
         return $.trim($(this).text());
      }).get();
    });
  }

  function retrieveDates() {
    get_dates_ajax_request.execute();
  }

  function renderDatesFilter(retrievedData) {
    if(retrievedData) {
      $("#content-section #form-and-button").append(
        "<div id=\"dateRangePickerWrapper\" class=\"date-range-picker-wrapper pull-right column large-2 row\">" +
          "<input id=\"dateRangePicker\" class=\"column\" type=\"text\" name=\"daterange\" value=\"01/01/2015 - 01/31/2015\" />" +
          "<i class=\"glyphicon glyphicon-calendar fa fa-calendar\"></i>&nbsp" +
        "</div>"
      );

      $("#dateRangePicker").val(formatDate(retrievedData.min) + " - " + formatDate(retrievedData.max));

      $('#dateRangePicker').daterangepicker({
        showDropdowns: true,
        ranges: {
          "Today": [moment(), moment()],
          "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          "Last 7 Days": [moment().subtract(6, 'days'), moment()],
          "Last 30 Days": [moment().subtract(29, 'days'), moment()],
          "This Month": [moment().startOf('month'), moment().endOf('month')],
          "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: "left",
        format: "YYYY/MM/DD",
        startDate: moment(retrievedData.min),
        endDate: moment(retrievedData.max),
        minDate: moment(retrievedData.min),
        maxDate: moment(retrievedData.max)
      }, function(start, end) {
        $("#dateRangePicker").val(formatDate(start) + " - " + formatDate(end));

        dates_selected.min = start.toDate().toDateString();
        dates_selected.max = end.toDate().toDateString();

        if(!compareDates(dates_on_open.min, dates_selected.min) || !compareDates(dates_on_open.max, dates_selected.max))
          context.reload();
      });
    }
  }

  function renderAddEntryButton() {
    $("#content-section #form-and-button").append(
      "<div id=\"addEntryButton\" class=\"button\">" +
        "<span>Nueva entrada </span>" +
        "<i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i>" +
      "</div>"
    );

    setAddEntryEventHandlers();
  }

  function setAddEntryEventHandlers() {
    $("#content-section #form-and-button #addEntryButton").click(function(event) {
      page.redirect("/editor/create");
    });
  }

  function renderTable(postsData) {
    $("#content-section #table-section").html(
      "<div class=\"table-scroll\">" +
        "<table id=\"entriesTable\" cellspacing=\"0\" cellpadding=\"0\">" +
          "<thead>" +
            "<tr>" +
              "<th>Fecha de publicación</th>" +
              "<th>Título</th>" +
              "<th>Categorías</th>" +
              "<th></th>" +
            "</tr>" +
          "</thead>" +
          "<tbody>" +
          "</tbody>" +
        "</table>" +
      "</div>"
    );

    renderTableBody(postsData);

    $("#content-section #table-section table").floatThead();

    setTableEventHandlers();
  }

  function renderTableBody(postsData) {
    let html;
    for(let i = 0; i < postsData.length; i++) {
      let date = formatDate(postsData[i].date);
      html = "<tr id=\"" + postsData[i]._id + "\" class=\"" + (i % 2 === 0 ? "even" : "odd") + "\">" +
          "<td class=\"date\">" + date + "</td>" +
          "<td class=\"title\">" + postsData[i].title + "</td>" +
          "<td class=\"categories\">";
      for(let j = 0; j < postsData[i].categories.length; j++) {
        html += postsData[i].categories[j];
        if(j !== postsData[i].categories.length - 1)
          html += ", ";
      }
      html +=
          "</td>" +
          "<td class=\"buttons row align-right\">" +
            "<i class=\"column large-2 fa fa-pencil\" aria-hidden=\"true\"></i>" +
            "<i class=\"column large-2 fa fa-trash\" aria-hidden=\"true\"></i>" +
          "</td>" +
        "</tr>";

      $("#content-section #table-section table tbody").append(html);
    }
  }

  function setTableEventHandlers() {
    $("i.fa.fa-pencil").click(function(event) {
      let id = $(event.currentTarget).parent().parent().attr("id");
      page.redirect("/editor/edit/" + id);
    });

    $("i.fa.fa-trash").click(function(event) {
      $('#confirmationModal #confirmationModalText').html(
        "<p id=\"" + $(event.currentTarget).parent().parent().attr("id") + "\">¿Estás seguro de que quieres eliminar esta entrada?</p>" +
        "<p>Título: " + $(event.currentTarget).parent().parent().find(".title").text() + "</p>" +
        "<p>Categorías: " + $(event.currentTarget).parent().parent().find(".categories").text() + "</p>" +
        "<p>Fecha: " + $(event.currentTarget).parent().parent().find(".date").text() + "</p>"
      );
      if($('#confirmationModal').hasClass("save-post"))
        $('#confirmationModal').removeClass("save-post");
      $('#confirmationModal').addClass("delete-post");

      $(document).foundation();
      $('#confirmationModal').foundation('open');
    });
  }

  function deletePost(event) {
    let id = $(event.currentTarget).parent().parent().find("#confirmationModalText").find("p:first-child").attr("id");
    delete_post_ajax_request.setConfigProperty("data", {id: id});
    delete_post_ajax_request.execute();
  }

  function showNoEntriesText() {
    $("#content-section #table-section").empty();
    $("#content-section #table-section").html("<h2 class=\"no-entries-text\"> Lo sentimos, pero por el momento no hay entradas disponibles en esta sección.</h2>");
  }
}
