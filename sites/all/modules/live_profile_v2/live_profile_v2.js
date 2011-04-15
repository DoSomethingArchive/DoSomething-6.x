$(document).ready( function() {
  $('div.live-profile .field').show();
  $('div.live-profile div.profile-value').hide();
  $('div.live-profile div.no-javascript-info').hide();
});

function updateProfile(theForm) {
    var returnVal=true;
    var errorString='';
    $(theForm).find('div.live-profile .field').each( function() {
      //var field = $(this).prev().attr('class').split(' ')[2];
      var field = $(this).attr('id');
      var new_value = $(this).val();
      /*if ( $(this).attr('id') == 'state-select' ) {
        field = 'profile_state';
      }*/
      var path = '/live_profile_v2_router/' + field + '/' + encodeURIComponent(new_value);
      //console.log("%o", path);
      $.ajax({
          cache: 'false',
          url: path,
          dataType: 'json',
          async: false,
          success: function(data) {
            if (data.success != true) {
              returnVal = false;
              errorString = errorString + (data.msg) + "\n";
            } else if (returnVal != false) {
              returnVal=true;
            }
          }
      });
    });
    if (returnVal == false) {
      alert(errorString);
    }
    return returnVal;
}