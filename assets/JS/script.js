// Initialize recentSearch array from localStorage
var recentSearch = JSON.parse(localStorage.getItem("recentSearch")) || [];

$(function () {
	// Set up autocomplete for the search input
	$("#searchTerm").autocomplete({
		source: recentSearch,
	});
});

function fetchData(foodInput, dietInput, alergiesInput, mealTypeInput) {
	// Construct the API query URL
	var queryURL =
		"https://api.edamam.com/api/recipes/v2?type=public&q=" +
		foodInput +
		"&app_id=3cbe9e09&app_key=791997979c9223cd8754bcf36f69f9c2" +
		dietInput +
		alergiesInput +
		mealTypeInput;
	console.log(queryURL);

	// Make AJAX request to the API
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		// Extract relevant data from the API response
		console.log(response);
		console.log(response.hits);
		console.log(response.hits[0]);
		console.log(response.hits[0].recipe.images.regular);
		console.log(response.hits[0].recipe.ingredientLines);
		console.log(response.hits[0].recipe.url);
		console.log(response.hits[0].recipe.label);
	});
}

function saveHistory(foodInput) {
	// Check if recentSearch array is empty
	if (recentSearch.length === 0) {
		// If empty, add foodInput to the array
		recentSearch.push(foodInput);
	} else {
		var isDuplicate = false;

		// Loop through the array to check for duplicates
		for (var i = 0; i < recentSearch.length; i++) {
			// If foodInput already exists in the array, set isDuplicate to true and exit the loop
			if (foodInput === recentSearch[i]) {
				isDuplicate = true;
				break;
			}
		}

		// If foodInput does not exist in the array and isDuplicate is still false, add it to the array
		if (!isDuplicate) {
			recentSearch.push(foodInput);
		}
	}

	// Sort the array alphabetically
	recentSearch.sort();

	// Store the updated array in local storage
	localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
}

$("#searchButton").on("click", function (event) {
	event.preventDefault();

	// Function to capitalize the first letter of a string
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Get the food name input value and trim any whitespace and capitalize the first letter
	var foodInput = $("#searchTerm").val().trim();
	foodInput = capitalizeFirstLetter(foodInput);
	var dietInput = $("#diet").find(":selected").data("name");
	var alergiesInput = $("#alergies").find(":selected").data("name");
	var mealTypeInput = $("#meal-type").find(":selected").data("name");

	saveHistory(foodInput);

	// Fetch recipe data for the entered food name
	fetchData(foodInput, dietInput, alergiesInput, mealTypeInput);
	searchVideos(foodInput);
});

$(document).ready(function () {});

function searchVideos(foodInput) {
	// Construct the API query URL
	var queryURL =
		"https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
		foodInput +
		"-recipe&type=video&key=AIzaSyBa9lY2xF5vOJmaKGWxcJGgtx0w9fByZSk";

	// Make AJAX request to the API
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		// Extract relevant data from the API response
		console.log(response);
	});
}
