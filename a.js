var windowHasFocus;

$(window).focus(function() {
  windowHasFocus = true;
}).blur(function() {
  windowHasFocus = false;
});

function goToUri(uri) {
  document.location = uri;
  setTimeout(function(){
    if(windowHasFocus) {
      if(confirm('You do not seem to have Qobuz installed, do you want to go download it now?')){
        document.location = 'http://www.qobuz.com';
      }
    }
  }, 100);
}

$('a').on('click', function(){ 
  goToUri($(this).data('uri')); 
});​
