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
		var data = response.hits;
		var image = response.hits[0].recipe.images.REGULAR;
		var ingrLines = response.hits[0].recipe.ingredientLines;
		var recipelabel = response.hits[0].recipe;
		displayResults(image, ingrLines, recipelabel, data);
	});
}

function iterateResults(i, data) {
	var image = data[i].recipe.images.REGULAR;
	var ingrLines = data[i].recipe.ingredientLines;
	var recipelabel = data[i].recipe;

	$("#photo").attr("src", image.url);
	$("#recipeName").text(recipelabel.label);

	// Clear previous ingredient lines
	$(".ingredients").empty();

	$.each(ingrLines, function (index, line) {
		// Append the ingredient line to the ul with class "ingredients"
		$(".ingredients").append("<li>" + line + "</li>");
	});

	$("#maincontainer")
		.append(
			'<a href="' +
				data[i].recipe.url +
				'" target="_blank">Click Here and follow the Directions</a>'
		);

	var buttonsContainer = $("<div>")
		.addClass("row")
		.css("background-color", "#2d3e50");

	$("button>").addClass("text-white").text("<").appendTo(buttonsContainer);
	$("h6>").addClass("text-white").text(i).appendTo(buttonsContainer);
	$("h6>").addClass("text-white").text("/").appendTo(buttonsContainer);
	$("h6>")
		.addClass("text-white")
		.text(data.hits.length)
		.appendTo(buttonsContainer);
	$("button>").addClass("text-white").text(">").appendTo(buttonsContainer);
}

function displayResults(image, ingrLines, recipelabel, data) {
	$("#photo").attr("src", image.url);
	$("#recipeName").text(recipelabel.label);

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

	$("#maincontainer")
		.append(
			'<a href="' +
				data[0].recipe.url +
				'" target="_blank">Click Here and follow the Recipe Directions</a>'
		);

	$("#maincontainer")
		.append("<h5>Use the buttons to check for other recipes</h5>");

	var buttonsContainer = $("<div>").addClass(
		"row d-flex justify-content-around align-items-center"
	);
	// .css("background-color", "#2d3e50");

	$("<button>")
		.addClass("col-2 btn btn-lg btn-block")
		.text("<")
		.appendTo(buttonsContainer);

	$("<h6>")
		.addClass("pt-3 col-3")
		.text("1 / " + data.length)
		.appendTo(buttonsContainer);

	$("<button>")
		.addClass("col-2 btn btn-lg btn-block")
		.text(">")
		.appendTo(buttonsContainer);

	$("#maincontainer").append(buttonsContainer);
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
		"-recipe&type=video&key=AIzaSyCJ8OYo2IstOyF4cTPB8RdifVPOX7kSLiU";

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
			.addClass("col-12 text-center mb-3 pt-3")
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
	// Set a cookie with SameSite attribute
	document.cookie = "cookieName=cookieValue; SameSite=Lax";
	$("#recipeVideos").css("display", "none");
	$("#videoResult").empty();
});
