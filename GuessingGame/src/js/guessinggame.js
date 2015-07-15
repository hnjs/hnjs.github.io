// ------------------------------------------
// 			Guessing Game Object
// ------------------------------------------

function GGame(maxGuesses) {
	this.secret = randomNumber(100);
	this.maxGuesses = maxGuesses;
	this.leftGuesses = maxGuesses;
	this.prevGuesses = [];
}

GGame.prototype.analyzeGuess = function(input) {
	var diff = input - this.secret,
		absDiff = diff > 0 ? diff : -diff,
		returnText = "";

	if (diff === 0) {
		returnText = "Bingo! You guessed the number "+input+". Game Over!";
		return [returnText ,"#5cb85c", true];		
	}

	returnText += (absDiff < 10) ? "Super Hot" : (absDiff < 30) ? "Hot" : (absDiff < 50) ? "Warm" : (absDiff < 70) ? "Cold" : "Ice Cold";
	
	if (diff > 0) {
		returnText += ". Guess lower.";
	} else {
		returnText += ". Guess higher.";
	}

	return [returnText, "#d9534f", false];
}

GGame.prototype.wasAlreadyGuessed = function(input) {
	return this.prevGuesses.indexOf(input) > -1;
}

// ------------------------------------------
// 				Helper functions
// ------------------------------------------

function randomNumber(upperLimit) {
	upperLimit = upperLimit || 100;
	return Math.floor(Math.random() * upperLimit) + 1;
}

function isValidInput(input) {
	return !isNaN(input) && input > 0 && input <= 100;
}

function setPastGuesses(str) {
	$("#pastguesses").text(str);
}

function setLeftGuesses(str) {
	$("#guessesleft").text(str);
}

function setStatus(str, color) {
	color = color || "black";
	$("#status").text(str);
	$("#status").css("color", color);
}

function disableInput(state) {
	$("#inputVal").prop("disabled", state);
}

function disableSubmit(state) {
	$("#guess").prop("disabled", state);
}

function disableHint(state) {
	$("#hint").prop("disabled", state);
}

function disableIO(state) {
	disableInput(state);
	disableSubmit(state);
	disableHint(state);
	if (state) {
		// when game over, play again button gains the focus
		$("#reset").focus();
	} else {
		// when game reset, input text gains the focus
		$("#inputVal").focus();
	}
}

// ------------------------------------------
// 				Handler functions
// ------------------------------------------

function processGuess(game) {
	var analysis = [],
		input = $("#inputVal").val();

	if (!isValidInput(input)) {
		alert("Only numbers from 1 to 100 are allowed");
		return false;
	}
	if (game.wasAlreadyGuessed(input)) {
		alert("You already guessed "+input);
		return false;
	}
	game.prevGuesses.push(input);
	game.leftGuesses--;
	setPastGuesses(game.prevGuesses.join(", "));
	setLeftGuesses(game.leftGuesses);
	
	$("#inputVal").val("");

	analysis = game.analyzeGuess(input);
	setStatus(analysis[0], analysis[1]);

	// if game over, disable the controls
	if (analysis[2]) {
		disableIO(true);
		return false; // stop event propagation upon game over
	}

	$("#guessesleft").trigger("change"); // invoke event on span element manually
}

function processReset() {
	var newGame = new GGame(5);
	setStatus("");
	setPastGuesses("");
	setLeftGuesses(newGame.leftGuesses);
	disableIO(false);
	return newGame;
}

function processHint(game) {
	if (game.prevGuesses.length == 0) {
		alert("Atleast one guess has to be made");
		return false;
	}
	setStatus("Hint used. Number is "+game.secret+". Game Over!", "red");
	disableIO(true);
}

// ------------------------------------------
// 		  Handle events when DOM ready
// ------------------------------------------
$('document').ready(function(){
	var game = new GGame(5);

	$("#inputVal").focus();

	$("#reset").click(function() {
		game = processReset();
	});

	$("#hint").click(function() {
		processHint(game);
	});

	$("#guess").click(function() {
		processGuess(game);
	});

	$("#inputVal").keypress(function(e){
		if (e.keyCode === 13) {processGuess(game);}
	});

	$("#guessesleft").on("change", function(e){
		if ($(this).text() == 0) {
			setStatus("No more guesses left. Number is "+game.secret+". Game Over!", "red");
			disableIO(true);
			return false; // stop event propagation upon game over
		}
	});
})


