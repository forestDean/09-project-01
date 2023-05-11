$(document).ready(function(){

    // Get iframe src attribute value - YouTube video url and store it in a variable 
    var url = $("#foodVideo").attr('src');
    
   // stops video from playing when modal is closed

      $("#myModal").on('hidden.bs.modal', function (e) {
        $("#myModal iframe").attr("src", $("#myModal iframe").attr("src"));
    });




});