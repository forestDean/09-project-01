// Initialize recentSearch and recent5daySearch arrays from localStorage
// var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];

var recentSearch = ["omelete", "roast", "carbonara", "peas"];

$(function () {
	$("#searchTerm").autocomplete({
		source: recentSearch,
	});
});

function fetchData(foodInput) {
	var queryURL =
		"https://api.edamam.com/api/recipes/v2?type=public&q=" +
		foodInput +
		"&app_id=3cbe9e09&app_key=791997979c9223cd8754bcf36f69f9c2";

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
		console.log(response.hits[0].recipe.label);
	});
}

$("#searchButton").on("click", function (event) {
	event.preventDefault();

	// Function to capitalize the first letter of a string
	// function capitalizeFirstLetter(string) {
	// 	return string.charAt(0).toUpperCase() + string.slice(1);
	// }

	// Get the city name input value and trim any whitespace
	var foodInput = $("#searchTerm");
	// console.log(foodInput);
	// foodInput = capitalizeFirstLetter(foodInput);

	// Fetch weather data for the entered city name
	fetchData(foodInput);
});
