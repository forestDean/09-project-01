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
		console.log(response.hits[0].recipe.images.REGULAR.url);
		console.log(response.hits[0].recipe.ingredientLines);
		console.log(response.hits[0].recipe.url);
		console.log(response.hits[0].recipe.label);
		var image = response.hits[0].recipe.images.REGULAR.url;
		ingrLines = response.hits[0].recipe.ingredientLines;
		displayResults(image, ingrLines);
	});
}

function displayResults(image, ingrLines) {
	$("#photo").attr("src", image);

	// Check if there are no search results
	if (ingrLines.length === 0) {
		// $("#videoResult").html("<p>No results found.</p>");
		return;
	}

	// Iterate through the ingredient lines and append them to the ul element
	$.each(ingrLines, function (index, line) {
		// Append the ingredient line to the ul with class "ingredients"
		$(".ingredients").append("<li>" + line + "</li>");
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

function searchVideos(search) {
	// Construct the API query URL
	var queryURL =
		"https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
		search +
		"-recipe&type=video&key=AIzaSyBa9lY2xF5vOJmaKGWxcJGgtx0w9fByZSk";

	// Make AJAX request to the API
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		// Extract relevant data from the API response
		console.log(response);
		displayYouTubeResults(response.items);
	});
}

function displayYouTubeResults(items) {
	// Show the recipeVideos section
	$("#recipeVideos").css("display", "block");

	// Clear the videoResult container
	$("#videoResult").empty();

	// Check if there are no search results
	if (items.length === 0) {
		$("#videoResult").html("<p>No results found.</p>");
		return;
	}

	// Iterate through the search results and display each video title and embed code
	$.each(items, function (index, item) {
		// Get the video title and format it
		var videoTitle = item.snippet.title;
		videoTitle = videoTitle.toLowerCase().replace(/\b\w/g, function (char) {
			return char.toUpperCase();
		});

		// Get the video ID
		var videoId = item.id.videoId;

		// Create the video embed code
		var embedCode =
			'<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
			videoId +
			'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

		// Append the video title and embed code to the videoResult container
		$("#videoResult")
			.addClass("col-sm-12 text-center mb-3 pt-3")
			.append("<h5>" + videoTitle + "</h5>")
			.append(embedCode);
	});
}

$("#searchButton").on("click", function (event) {
	event.preventDefault();
	// Empty the ul element with class "ingredients"
	$(".ingredients").empty();

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
	$("#searchTerm").val("");
});

$(document).ready(function () {
	$("#recipeVideos").css("display", "none");
	$("#videoResult").empty();
});
