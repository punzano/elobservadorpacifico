/**
* Generic Ajax Function v1.0
* @param {String} ajaxUri - URI path request.
* @param {String} responseVar - Variable where returned data will be asigned.
* @param {String} ajaxType - Ajax request type. Default: 'GET'.
* @param {String} dataType - Ajax data type. Default: 'JSON'.
* @param {Object} data - Ajax data to be sent to the server. Default: {}.
* @param {Boolean} ajaxAsync - Ajax asynchronous mode. Default: true.
* @param {Boolean} ajaxCache - Ajax cache. Default: true.
* @param {Array} callbacks - Name of the callback function.
*/

let AjaxRequest = function(options) {
  var receivedData;
  var config = {
    ajaxUri: "",
    loadingDivID: null,
    loadingImgSrc: "assets/img/loading.gif",
    ajaxType: 'GET',
    dataType: 'json',
    data: {},
    ajaxAsync: true,
    ajaxCache: true,
    onSuccessCallback: ""
  };

  $.extend(config, options);

  this.execute = function() {
    $.ajax({
      url: config.ajaxUri,
      type: config.ajaxType,
      dataType: config.dataType,
      data: config.data,
      async: config.ajaxAsync,
      cache: config.ajaxCache,
      beforeSend: function() {
        beforeSend()
      },
      error: function(xhr, status) {
        error(xhr, status)
      },
      success: function(retrievedData) {
        success(retrievedData)
      },
    });
  }

  function beforeSend() {
    if(config.loadingDivID) {
      $("#" + config.loadingDivID).empty();
      $("#" + config.loadingDivID)
        .html("<div id=\"" + config.loadingDivID + "-loading\" class=\"" + config.loadingDivID + "-loading row align-center\"><img class=\"align-self-middle\" src=\"" + config.loadingImgSrc + "\"></div>");
    }
  }

  function error(xhr, status) {
    if (status === "error") {
      console.log("Error " + xhr.status + " " + xhr.statusText + ": " + xhr.responseText)
    }
  }

  function success(retrievedData) {
    config.onSuccessCallback(retrievedData);
  }
};
