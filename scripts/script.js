const trashyApp = {};

//keys for APIS
trashyApp.movieKey = 'b8b83ba71713f763aef645ce0a40da06';
trashyApp.lcboKey = 'MDo5ZmU3YTdkYy04ODIzLTExZTctYWQ4NS0xZjBjYjgwNGFhNWM6NFNGeGFMaExyNFBtYzN4TTNFdDF3TGZJVTc1WEtPb1V6THpO';

//Get user's movie year input
trashyApp.getMovieYear = () => {
	$('form').on('submit', function(e) {
		e.preventDefault();
		let userYearChoice = $('input[name=userMovieYear__final]').val();
		if(userYearChoice < 1890 || userYearChoice > 2017) {
			alert('This is not a valid movie year. Please pick again.');
		} else {
			$('html, body').animate({
			scrollTop: $('#movieResults').offset().top
			}, 1000);
		trashyApp.getMovieInfo(userYearChoice);
		}	
	});
}

//gets movie information by user's year input and sort it by user ratings from lowest to highest
trashyApp.getMovieInfo = (userYearChoice) => {
	$.ajax({
		url: 'https://api.themoviedb.org/3/discover/movie/',
		method: 'GET',
		dataType: 'jsonp',
		data: {
			api_key: trashyApp.movieKey,
			primary_release_year: userYearChoice,
			sort_by: 'vote_average.asc',
			vote_average_lte: 3.0,
			include_adult: false
		}
	}).then((res) => {
		let resInfo = res.results;
		trashyApp.displayMovie(resInfo);
	});
}

//display 6 movie options on the screen 
trashyApp.displayMovie = (resInfo) => {
	$('#movieResults').empty();  
	resInfo.forEach((movie) => {
		if(movie.poster_path !== null && movie.overview !== '') {
			//creating h2 for description
			let movWords = $('<h2>').text('Now playing:')
			// creating h2 for movie title
			let movTitle = $('<h2>').text(movie.title);
			// creating img for movie poster
			let movImage = $('<img>').attr('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
			// creating p for movie description
			let movDescript = $('<p>').text(movie.overview);
			// creating div called movieSelect and appending the previous elements into it
			let movContainer = $('<div>').addClass('movieSelect').append(movWords, movTitle, movImage, movDescript); 
			//appending the information into the movie results section
			$('#movieResults').append(movContainer); 
			trashyApp.clickedMovie(movContainer);
		}
	});
}

//displays clicked movie poster and its information
trashyApp.clickedMovie = (movContainer) => {
	let movClicked = movContainer[0];
	$(movContainer).on('click', () => {
		$('#movieResults').fadeOut(1000, () => {
			$('#selectedResults').hide().append(movClicked).fadeIn(1000, trashyApp.getWineInfo());
		});
		$(movContainer).off('click');
	});
} 

//gets wine information from LCBO API
trashyApp.getWineInfo = (cheapWineRec) => {
	$.ajax({
		url: 'https://lcboapi.com/products',
		type: 'GET',
		dataType: 'json',
		data: {
			access_key: trashyApp.lcboKey,
			q: 'red wine',
			order: 'price_in_cents.asc'
		}
	}).then((res) => {
		let resWineInfo = res.result;
		trashyApp.getWineSelection(resWineInfo);
	});
}

//randomly select a cheap wine out of the response
trashyApp.getWineSelection = (resWineInfo) => {
	let randomWines = resWineInfo;
	let randomWine = randomWines[Math.floor(Math.random() * resWineInfo.length)];
	trashyApp.displayWineInfo(randomWine);
}

//displays wine info onto the page 
trashyApp.displayWineInfo = (randomWine) => {
	let dollarPrice = (randomWine.price_in_cents/100).toFixed(2)
	// creating h2 for description
	let wineWords = $('<h2>').text(`Cheap wine recommendation to enhance (or forget) the movie experience.`);
	// creating h2 for wine name
	let wineName = $('<h2>').text(randomWine.name);
	// creating img for wine
	let wineImage = $('<img>').attr('src', randomWine.image_url);
	//creating p for volume in milliliters
	let wineVolume = $('<p>').text(`${randomWine.volume_in_milliliters} mL bottle`);
	// creating h3 for wine price
	let winePrice = $('<h3>').text(`$${dollarPrice}`);
	// creating div called wineSelect and appending the previous elements into it
	let wineContainer = $('<div>').addClass('wineSelect').append(wineWords, wineName, wineImage, wineVolume, winePrice); 
	//appending the information into the results section
	$('#selectedResults').append(wineContainer); 
}


//init function
trashyApp.init = () => {
	trashyApp.getMovieYear();
}

// Document ready
$(function () {
	trashyApp.init();
});