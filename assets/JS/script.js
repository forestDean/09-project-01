var queryURL =
	"https://api.edamam.com/api/recipes/v2?type=public&q=omelete&app_id=3cbe9e09&app_key=791997979c9223cd8754bcf36f69f9c2";

// Make AJAX request to API
$.ajax({
	url: queryURL,
	method: "GET",
}).then(function (response) {
	// Extract relevant data from API response
	console.log(response);
	console.log(response.hits);
	console.log(response.hits[0]);
	console.log(response.hits[0].recipe.images.regular);
	console.log(response.hits[0].recipe.ingredientLines);
	console.log(response.hits[0].recipe.url);
});
