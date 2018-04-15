function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd < 10)
    dd = '0'+dd

  if(mm < 10)
      mm = '0'+mm

  today = yyyy + '/' + mm + '/' + dd;

  return today;
}

function formatDate(date) {
  var today = new Date(date);
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd < 10)
    dd = '0'+dd

  if(mm < 10)
      mm = '0'+mm

  today = yyyy + '/' + mm + '/' + dd;

  return today;
}

function compareDates(date1, date2) {
  let date_1 = new Date(date1);
  let date_2 = new Date(date2);

  return (date_1.getDay() === date_2.getDay() && date_1.getMonth() === date_2.getMonth() && date_1.getYear() === date_2.getYear())
}

var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );

  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }
      return ret.join( '' );
  }

})();
