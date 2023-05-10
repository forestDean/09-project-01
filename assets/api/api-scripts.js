$(window).ready(function() { 
    console.log("Hi!");

    //var APIkey = ""
    var queryURL = "https://api.publicapis.org/entries";

    // Perfoming an AJAX GET request to our queryURL
    $.ajax({
      url: queryURL,
      method: "GET",
      // if no search match
      error: function() {
        // alert();
      }
    })

    // After the data from the AJAX request returns...
    .then(function(response) {  
      console.log(response);
    // iterate over JSON Object
      for (var i = 0; i < response.entries.length; i++) {
        //for (var i = 0; i < 5; i++) {
         console.log("i: " + i);
         var category = response.entries[i].Category;
         var api = response.entries[i].API;
         console.log(api);
         var description = response.entries[i].Description;
         var auth = response.entries[i].Auth;
         var link = response.entries[i].Link;

         // construct table
         var a = $("<tr>");
         a.addClass("row");

         a.append("<td>" + category + "</td>");
         a.append("<td>" + api + "</td>");
         a.append("<td>" + description + "</td>");
         a.append("<td>" + auth + "</td>");
         a.append('<td><a href="'+ link +'">Link</a></td>');
         
         // Adding the button to the HTML
         $("table").append(a);


        };

    });

}); // e/o onload