const DEBUG = 1;

var divisor; //global variable to hold the divisor
var dividend; //global variable to hold the dividend

var expectedOperation;

var shiftDown = 0;
var shiftRight = 0;

var quotientShiftRight = 0;

//origin is considered the x and y coordinates of the vertical division bar
var originX = getComputedStyle(document.body).getPropertyValue('--origin-x');
var originY = getComputedStyle(document.body).getPropertyValue('--origin-y');
var gridSpacing = getComputedStyle(document.body).getPropertyValue('--grid-cell-size');

var body = document.getElementById("body");
var responseBox = document.getElementById("responseBox");



var userInputForm = document.querySelector("#responseText");
var currentStep;
userInputForm.addEventListener("keyup", function (event) {
	if (event.key === 'Enter') {
		console.log('Enter key was pressed');
		switch (currentStep) {
			case "divide":
				executeDivisionStep();
				break;
			case "multiply":
				executeMultiplicationStep();
				break;
			case "subtract":
				executeSubtractionStep();
				break;
			case "bringdown":
				executeBringDownStep();
				break;
			case "remainder":
				executeRemainderStep();
				break;
		}
	}
});

const placeValueStyles = [ //CSS class names of different place values
	"ones-place",
	"tens-place",
	"hundreds-place",
	"thousands-place"
];

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function gameInit() {
	if (DEBUG) console.log("Entering function gameInit()...");
	//switch pages
	menuPage.style.display = 'none';
	gamePage.style.display = 'block';

	divisor = getRandomInt(20) + 1;
	dividend = divisor * (getRandomInt(75) + 10)
		+ (Math.random() < 0.45 ? getRandomInt(20) : 0);

	console.log("Divisor: " + divisor);
	console.log("Dividend: " + dividend);
	console.log("OriginX: " + originX);
	console.log("OriginY: " + originY);

	//DISPLAY THE DIVISOR
	var number = divisor;
	var placeValue = 0;
	while (number > 0) {
		let lowestPlaceValue = number % 10;
		number = Math.floor(number / 10);
		var div = document.createElement('div');
		div.classList.add("digit", placeValueStyles[placeValue]);
		div.style.left = "calc(" + originX + " - " + "(" + gridSpacing + " * " + (placeValue + 1) + "))";
		div.style.top = originY;
		div.innerHTML = lowestPlaceValue;
		document.body.appendChild(div);
		placeValue++;
	}

	//DISPLAY THE DIVIDEND
	var numDividendDigits = dividend.toString().length;
	number = dividend;
	placeValue = 0;
	while (number > 0) {
		let lowestPlaceValue = number % 10;
		// dividendDigitsArray[numDividendDigits-placeValue-1] = lowestPlaceValue;
		number = Math.floor(number / 10);
		var div = document.createElement('div');
		div.classList.add("digit", placeValueStyles[placeValue]);
		div.style.left = "calc(" + originX + " + " + "(" + gridSpacing + " * " + (numDividendDigits - placeValue - 1) + "))";
		div.style.top = originY;
		div.innerHTML = lowestPlaceValue;
		div.id = "pv" + placeValue;
		document.body.appendChild(div);
		placeValue++;
	}

	//PROMPT THE USER
	updatePrompt("What should you do first?");
	expectedOperation = "divide";


	if (DEBUG) console.log("...Leaving function gameInit()");
}


function speakTxt(operation) {
	var speech = new SpeechSynthesisUtterance(operation);
	window.speechSynthesis.speak(speech);
}

var delay = function (btnElement, callback) {
	var timeout = null;
	console.log("btnElement" + btnElement);

	if (btnElement != null) {
		btnElement.onmouseover = function () {
			// Set timeout to be a timer which will invoke callback after 1s
			timeout = setTimeout(callback, 300);
		};

		btnElement.onmouseout = function () {
			// Clear any timers set to timeout
			clearTimeout(timeout);
		}
	}

};

delay(document.getElementById('divideBtn'), function () {
	var speech = new SpeechSynthesisUtterance('divide');
	window.speechSynthesis.speak(speech);
});
delay(document.getElementById('multiplyBtn'), function () {
	var speech = new SpeechSynthesisUtterance('multiply');
	window.speechSynthesis.speak(speech);
});
delay(document.getElementById('subtractBtn'), function () {
	var speech = new SpeechSynthesisUtterance('subtract');
	window.speechSynthesis.speak(speech);
});
delay(document.getElementById('bringDownBtn'), function () {
	var speech = new SpeechSynthesisUtterance('bring down');
	window.speechSynthesis.speak(speech);
});
delay(document.getElementById('repeatBtn'), function () {
	var speech = new SpeechSynthesisUtterance('repeat');
	window.speechSynthesis.speak(speech);
});
delay(document.getElementById('remainderBtn'), function () {
	var speech = new SpeechSynthesisUtterance('remainder');
	window.speechSynthesis.speak(speech);
});



function playerSelectionHandler(selection) {
	if (DEBUG) console.log("Entering function playerSelectionHandler()...");
	//this function is called by operation buttons
	//sets global selection variable which in gameMain() to progress the game
	switch (selection) {
		case "divide":
			if (checkValidSelection(selection, expectedOperation)) {
				initDivisionStep();
			}
			break;
		case "multiply":
			if (checkValidSelection(selection, expectedOperation)) {
				initMultiplicationStep();
			}
			break;
		case "subtract":
			if (checkValidSelection(selection, expectedOperation)) {
				initSubtractionStep();
			}
			break;
		case "bringdown":
			if (checkValidSelection(selection, expectedOperation)) {
				initBringDownStep();
			}
			break;
		case "repeat":
			if (checkValidSelection(selection, expectedOperation)) {
				repeatStep();
			}
			break;
		case "remainder":
			if (checkValidSelection(selection, expectedOperation)) {
				initRemainderStep();
			}
			break;
	}
	if (DEBUG) console.log("...Leaving function playerSelectionHandler()");
}

function checkValidSelection(selection, expectedOperation) {
	if (DEBUG) console.log("Entering function checkValidSelection()...");
	if (selection != expectedOperation) {
		updatePrompt("Not quite! Please try again!");
		return false;
	}
	else if (selection == expectedOperation) {
		return true;
	}
	if (DEBUG) console.log("...Leaving function checkValidSelection()");
}

function updatePrompt(text) {
	if (DEBUG) console.log("Entering function updatePrompt()...");
	var prompt = document.getElementById("prompt");
	prompt.innerHTML = text;


	var promptTxt = prompt.textContent;
	var speech = new SpeechSynthesisUtterance(promptTxt);
	window.speechSynthesis.speak(speech);


	if (DEBUG) console.log("...Leaving function updatePrompt()");
}

function updateSecondaryPrompt(text) {
	if (DEBUG) console.log("Entering function updateSecondaryPrompt()...");
	var prompt = document.getElementById("prompt");
	prompt.innerHTML = text;


	var promptTxt = prompt.textContent;
	var speech = new SpeechSynthesisUtterance(promptTxt);
	window.speechSynthesis.speak(speech);


	if (DEBUG) console.log("...Leaving function updateSecondaryPrompt()");

}

var buttonsEnabled = true;
function toggleOperationButtons() {
	if (DEBUG) console.log("Entering function toggleOperationButton()...");
	var buttonContainer = document.getElementById("buttonContainer");
	var buttons = buttonContainer.querySelectorAll("button");

	for (i = 0; i < buttons.length; i++) {
		buttons[i].disabled = !(buttons[i].disabled);
	}


	if (DEBUG) console.log("...Leaving function toggleOperationButtons()");
}

function positionResponseBox(shiftX, shiftY, width) {

	var top = "calc(" + originY + " + " + "(" + shiftY + " * " + gridSpacing + "))";
	responseBox.style.top = top;

	var left = "calc(" + originX + " + " + "(" + gridSpacing + " * " + (shiftX) + "))";
	responseBox.style.left = left;

	var width = "calc(" + width + " * " + gridSpacing + ")";
	responseBox.style.width = width;

	responseBox.style.display = "block";
}

function positionDigit(shiftX, shiftY, value, style) {
	var div = document.createElement('div');
	div.classList.add("digit", style);

	var top = "calc(" + originY + " + " + "(" + shiftY + " * " + gridSpacing + "))";
	div.style.top = top;

	var left = "calc(" + originX + " + " + "(" + gridSpacing + " * " + (shiftX) + "))";
	div.style.left = left;

	div.innerHTML = value;
	document.body.appendChild(div);
}

function positionSubtractionSymbol(shiftX, shiftY) {

	//create container div that will hold the subtraction symbol and place it on the grid
	var subSymbolContainer = document.createElement('div');
	subSymbolContainer.classList.add("subtraction-symbol-container");

	var top = "calc(" + originY + " + " + "(" + shiftY + " * " + gridSpacing + "))";
	subSymbolContainer.style.top = top;

	var left = "calc(" + originX + " + " + "(" + gridSpacing + " * " + (shiftX) + "))";
	subSymbolContainer.style.left = left;

	//create the subtraction symbol element and add it to the container which will center it correctly
	var subSymbol = document.createElement('div');
	subSymbol.classList.add("subtraction-symbol");

	subSymbolContainer.appendChild(subSymbol);

	document.body.appendChild(subSymbolContainer);
}

function positionSubtractionBar(shiftX, shiftY, width) {

	//create container div that will hold the subtraction symbol and place it on the grid
	var subBar = document.createElement('div');
	subBar.classList.add("subtraction-bar");

	var top = "calc(" + originY + " + " + "(" + shiftY + " * " + gridSpacing + "))";
	subBar.style.top = top;

	var left = "calc(" + originX + " + " + "(" + gridSpacing + " * " + (shiftX) + "))";
	subBar.style.left = left;

	var width = "calc(" + width + " * " + gridSpacing + ")";
	subBar.style.width = width;

	document.body.appendChild(subBar);
}

function positionBringDownArrow(shiftX, shiftY) {

	var top;
	var left;

	var tailWidth = getComputedStyle(document.getElementById("arrowHeadRight")).getPropertyValue('--arrow-head-width');

	var leftHead = document.createElement('div');
	leftHead.classList.add("bring-down-arrow-head-left");

	top = "calc(" + originY + " + 1.6 * " + shiftY + " * " + gridSpacing + ")";
	left = "calc(" + originX + " + (0.5  + " + shiftX + ")  * " + gridSpacing + " - " + tailWidth + " - " + tailWidth + "/2 - 1px)";

	leftHead.style.left = left;
	leftHead.style.top = top;
	leftHead.style.display = "block";

	console.log("ARROW-LEFT, left: " + left);
	console.log("ARROW-LEFT, top: " + top);

	document.body.appendChild(leftHead);

	var rightHead = document.createElement('div');
	rightHead.classList.add("bring-down-arrow-head-right");

	top = "calc(" + originY + " + 1.6 * " + shiftY + " * " + gridSpacing + ")";
	left = "calc(" + originX + " + (0.5 + " + shiftX + ") * " + gridSpacing + " + " + tailWidth + " - " + tailWidth + "/2 - 1px)";

	console.log("ARROW-RIGHT, left: " + left);
	console.log("ARROW-RIGHT, top: " + top);

	rightHead.style.top = top;
	rightHead.style.left = left;
	rightHead.style.display = "block";

	document.body.appendChild(rightHead);

	var tailWidth = getComputedStyle(document.getElementById("arrowTail")).getPropertyValue('--arrow-tail-width');

	var tail = document.createElement('div');
	tail.classList.add("bring-down-arrow-tail");

	// top: calc(7.2*var(--grid-cell-size));
	// left: calc(7.5*var(--grid-cell-size) - var(--arrow-tail-width)/2 - var(--grid-offset));
	top = "calc(" + originY + " + (0.2 + " + shiftY + ") * " + gridSpacing + ")";
	left = "calc(" + originX + " + (0.5 + " + shiftX + ") * " + gridSpacing + " - " + tailWidth + "/2 - 1px)";

	console.log("TAIL, left: " + left);
	console.log("TAIL, top: " + top);

	tail.style.left = left;
	tail.style.top = top;
	tail.style.display = "block";

	document.body.appendChild(tail);

}


var numDividendDigits;
var digitCount;
var pseudoDividend;
var correctResponse;
var firstpass = true;
function initDivisionStep() {
	if (DEBUG) console.log("Entering function initDivisionStep()...");

	currentStep = "divide";

	toggleOperationButtons();

	numDividendDigits = dividend.toString().length;
	digitCount = 1;

	if (firstpass) {
		pseudoDividend = Math.floor(dividend / (10 ** (numDividendDigits - digitCount)));
		console.log("psuedoDividend: " + pseudoDividend);
	}


	prompt = "How many times does " + divisor + " go into " + pseudoDividend + "?";
	updateSecondaryPrompt(getPositiveExclamation() + prompt);

	positionResponseBox(quotientShiftRight, -1, 1);


	if (DEBUG) console.log("...Leaving function initDivisionStep()");
}

function executeDivisionStep() {
	if (DEBUG) console.log("Entering function executeDivisionStep()...");
	var userResponse = parseInt(userInputForm.value); //grab user input from the userInputForm field
	userInputForm.value = ""; //reset user input form
	correctResponse = Math.floor(pseudoDividend / divisor); //calculate the correct response

	console.log("UserReponse: " + userResponse);
	console.log("CorrectResponse: " + correctResponse);

	if (userResponse != correctResponse) { //user did not correctly answer question so we need to ask again
		updateSecondaryPrompt("Sorry, not quite! " + prompt);
		userInputForm.value = ""; //reset user input form
		if (DEBUG) console.log("...Leaving function executeDivisionStep()");
		return;
	}

	positionDigit(quotientShiftRight, -1, correctResponse, placeValueStyles[numDividendDigits - quotientShiftRight - 1]);
	digitCount++;
	quotientShiftRight++;

	/* divisor did not fit into psuedodividend so we need to look at next place value and ask again */
	if (correctResponse == 0 && firstpass) {
		pseudoDividend = Math.floor(dividend / (10 ** (numDividendDigits - digitCount)));
		positionResponseBox(quotientShiftRight, -1, 1);
		prompt = "Now, how many times does " + divisor + " go into " + pseudoDividend + "?";
		updateSecondaryPrompt(getPositiveExclamation() + prompt);
		if (DEBUG) console.log("...Leaving function executeDivisionStep()");
		return;
	}
	/* division step has finished so we need to update the interface */
	else {
		terminateDivisionStep();
	}

	if (DEBUG) console.log("...Leaving function executeDivisionStep()");
}

function terminateDivisionStep() {
	responseBox.style.display = "none";
	toggleOperationButtons();

	expectedOperation = "multiply";
	selection = "";

	updatePrompt("Which step is next?");
}


//variables used during the multiplication step
var factor1; //the first number being multipled
var factor2; //the second number being multiplied
var product; //the result of the multiplication operation
function initMultiplicationStep() {
	if (DEBUG) console.log("Entering function initMulitiplicationStep()...");

	factor1 = divisor; //the first factor should equal the divisor
	factor2 = correctResponse; //the second factor should the be the result of the previous operation

	currentStep = "multiply";


	prompt = "What is " + divisor + " multiplied by " + correctResponse + "?";
	updateSecondaryPrompt(getPositiveExclamation() + prompt);

	toggleOperationButtons();

	// numDividendDigits = dividend.toString().length;
	// digitCount = 1;

	product = Math.floor(factor1 * factor2); //calculate the correct response

	var responseBoxWidth = product.toString().length;
	console.log("responseBoxWidth: " + responseBoxWidth);
	shiftDown++;

	// if(!firstpass && responseBoxWidth >= 2) {
	// 	shiftRight--;
	// }
	// positionResponseBox(shiftRight, shiftDown, responseBoxWidth);
	shiftRight = quotientShiftRight;
	positionResponseBox(shiftRight - responseBoxWidth, shiftDown, responseBoxWidth);


	if (DEBUG) console.log("...Leaving function initMultiplicationStep()");
}

function executeMultiplicationStep() {
	if (DEBUG) console.log("Entering function executeMulitiplicationStep()...");
	var userResponse = parseInt(userInputForm.value); //grab user input from the userInputForm field
	userInputForm.value = ""; //reset user input form

	if (userResponse != product) { //user did not correctly answer question so we need to ask again
		updateSecondaryPrompt("Sorry, not quite! " + prompt);
		userInputForm.value = ""; //reset user input form
		if (DEBUG) console.log("...Leaving function executeMultiplicationStep()");
		return;
	}
	else {
		//answer was correct so draw the digits

		var productDigits = product.toString().split('');
		var productDigitsArr = productDigits.map(Number);
		numDigits = productDigitsArr.length;

		// for(i=numDigits-1; i>=0; i--) {
		// 	var shiftX = shiftRight-1-i;
		// 	positionDigit(shiftX, shiftDown, productDigitsArr[i], placeValueStyles[numDividendDigits-1-shiftX]);
		// }

		for (i = 0; i < numDigits; i++) {
			positionDigit(shiftRight - 1 - i, shiftDown, productDigitsArr[numDigits - 1 - i], placeValueStyles[numDividendDigits - shiftRight + i]);
			console.log(productDigitsArr[numDigits - 1 - i]);
		}
		terminateMultiplicationStep();
	}



	if (DEBUG) console.log("...Leaving function executeMultiplicationStep()");
}

function terminateMultiplicationStep() {
	if (DEBUG) console.log("Entering function terminateMulitiplicationStep()...");
	responseBox.style.display = "none";
	toggleOperationButtons();

	expectedOperation = "subtract";
	selection = "";

	updatePrompt("That's right! Which step is next?");
	if (DEBUG) console.log("...Leaving function terminateMultiplicationStep()");
}

//variables used during subtraction step
var minuend; //the number being subtracted from
var subtrahend; //the amount being subtracted
var difference; //the result of the subtraction operation
function initSubtractionStep() {
	if (DEBUG) console.log("Entering function initSubtractionStep()...");

	currentStep = "subtract";
	toggleOperationButtons();

	subtrahend = product; //the minuend should be the product from the mulitplication step
	minuend = pseudoDividend; //the subtrahend should be pseudoDividend (the part of the dividend that aligns with the minuend, assigned in the division step)


	prompt = "What is " + minuend + " minus " + subtrahend + "?";
	updateSecondaryPrompt(getPositiveExclamation() + prompt);

	difference = Math.floor(minuend - subtrahend); //calculate the correct response
	console.log("difference: " + difference);

	console.log("PRODUCT: " + product);
	console.log("PRODUCT LENGTH: " + product.toString().length);
	console.log("SHIFTRIGHT: " + shiftRight);
	// console.log("SHIFT")


	shiftDown++;

	var responseBoxWidth = difference.toString().length;
	positionResponseBox(shiftRight - responseBoxWidth, shiftDown, responseBoxWidth);

	positionSubtractionSymbol(shiftRight - minuend.toString().length - 1, shiftDown - 1);
	positionSubtractionBar(shiftRight - minuend.toString().length, shiftDown, minuend.toString().length);


	// shiftRight = shiftRight + (product.toString().length - difference.toString().length);
	// positionResponseBox(shiftRight, shiftDown, responseBoxWidth);

	// positionSubtractionSymbol(shiftRight + responseBoxWidth - product.toString().length - 1, shiftDown-1);
	// positionSubtractionBar(shiftRight + responseBoxWidth - product.toString().length, shiftDown, pseudoDividend.toString().length);

	if (DEBUG) console.log("...Leaving function initSubtractionStep()");
}

function executeSubtractionStep() {
	if (DEBUG) console.log("Entering function executeSubtractionStep()...");
	var userResponse = parseInt(userInputForm.value); //grab user input from the userInputForm field
	userInputForm.value = ""; //reset user input form

	if (userResponse != difference) { //user did not correctly answer question so we need to ask again
		updateSecondaryPrompt("Sorry, not quite! " + prompt);
		userInputForm.value = ""; //reset user input form
		if (DEBUG) console.log("...Leaving function executeSubtractionStep()");
		return;
	}
	else {
		//answer was correct so draw the digits

		var differenceDigits = difference.toString().split('');
		var differenceDigitsArr = differenceDigits.map(Number);
		var numDifferenceDigits = differenceDigitsArr.length;

		for (i = 0; i < numDifferenceDigits; i++) {
			positionDigit(shiftRight - 1 - i, shiftDown, differenceDigitsArr[numDifferenceDigits - 1 - i], placeValueStyles[numDividendDigits - shiftRight + i]);
		}

		terminateSubtractionStep();
	}
	// + responseBoxWidth - 1


	if (DEBUG) console.log("...Leaving function executeSubtractionStep()");
}

function terminateSubtractionStep() {
	if (DEBUG) console.log("Entering function terminateSubtractionStep()...");

	responseBox.style.display = "none";
	toggleOperationButtons();

	if (numDividendDigits > shiftRight) {
		expectedOperation = "bringdown";
	}
	else {
		expectedOperation = "remainder";
	}
	selection = "";

	updatePrompt("That's right! Which step is next?");

	if (DEBUG) console.log("...Leaving function terminateSubtractionStep()");
}


var bringDownNumber; //number to bringdown
function initBringDownStep() {
	if (DEBUG) console.log("Entering function initSubtractionStep()...");

	currentStep = "bringdown";
	toggleOperationButtons();

	//map the digits of the dividend to separate numbers in an array
	var dividendDigits = dividend.toString().split('');
	var dividendDigitsArr = dividendDigits.map(Number);
	//the bringDownNumber should will be found in the dividendDigitsArr at the index that corresponds to the length of the psuedodividend (assigned in the div step)
	bringDownNumber = dividendDigitsArr[(pseudoDividend.toString().length)];
	console.log("bringDownNumber: " + bringDownNumber);


	prompt = "Now bring down the " + bringDownNumber + ".";
	updateSecondaryPrompt(getPositiveExclamation() + prompt);

	var responseBoxWidth = bringDownNumber.toString().length;
	console.log("responseBoxWidth: " + responseBoxWidth);
	positionResponseBox(shiftRight, shiftDown, responseBoxWidth);

	positionBringDownArrow(shiftRight, shiftDown - 1);

	if (DEBUG) console.log("...Leaving function initSubtractionStep()");
}

function executeBringDownStep() {
	if (DEBUG) console.log("Entering function executeBringDownStep()...");
	var userResponse = parseInt(userInputForm.value); //grab user input from the userInputForm field
	userInputForm.value = ""; //reset user input form

	if (userResponse != bringDownNumber) { //user did not correctly answer question so we need to ask again
		updateSecondaryPrompt("Oops, try again! " + prompt);
		userInputForm.value = ""; //reset user input form
		if (DEBUG) console.log("...Leaving function executeSubtractionStep()");
		return;
	}
	else {
		//answer was correct so draw the digits
		positionDigit(shiftRight, shiftDown, bringDownNumber, placeValueStyles[numDividendDigits - 1 - shiftRight]);

		terminateBringDownStep();
	}

	if (DEBUG) console.log("...Leaving function executeBringDownStep()");
}

function terminateBringDownStep() {
	if (DEBUG) console.log("Entering function terminateBringDownStep()...");

	responseBox.style.display = "none";
	toggleOperationButtons();

	expectedOperation = "repeat";
	selection = "";

	updatePrompt("That's right! Which step is next?");

	if (DEBUG) console.log("...Leaving function terminateBringDownStep()");
}

function repeatStep() {
	if (DEBUG) console.log("Entering function repeatStep()...");

	currentStep = "repeat";

	expectedOperation = "divide";
	selection = "";

	firstpass = false;

	pseudoDividend = Number(difference.toString() + bringDownNumber.toString());
	console.log("new dividend: " + dividend);

	updatePrompt(getPositiveExclamation() + "Which step is next?");

	if (DEBUG) console.log("...Leaving function repeatStep()");
}

var remainder;
function initRemainderStep() {
	if (DEBUG) console.log("Entering function initRemainderStep()...");

	toggleOperationButtons();

	currentStep = "remainder";

	remainder = difference; //the remainder should be equal to the difference from the substraction operation


	updatePrompt(getPositiveExclamation() + "What is the remainder?");

	positionDigit(quotientShiftRight, -1, "R", "remainder");
	quotientShiftRight++;
	positionResponseBox(quotientShiftRight, -1, 1);

	if (DEBUG) console.log("...Leaving function initRemainderStep()");
}

function executeRemainderStep() {
	if (DEBUG) console.log("Entering function executeRemainderStep()...");

	var userResponse = parseInt(userInputForm.value); //grab user input from the userInputForm field
	userInputForm.value = ""; //reset user input form

	if (userResponse != remainder) { //user did not correctly answer question so we need to ask again
		updateSecondaryPrompt("Oops, try again! " + prompt);
		userInputForm.value = ""; //reset user input form
		if (DEBUG) console.log("...Leaving function executeRemainderStep()");
		return;
	}
	else {
		//answer was correct so draw the digits
		positionDigit(quotientShiftRight, -1, remainder, "remainder");
		gameEnd();
	}

	if (DEBUG) console.log("...Leaving function executeRemainderStep()");
}

function gameEnd() {
	if (DEBUG) console.log("Entering function gameEnd()...");
	updateSecondaryPrompt("You did it! Now enter the final answer without leading zeroes.");

	//hide the operation buttons
	var buttonContainer = document.getElementById("buttonContainer");
	buttonContainer.style.display = "none";

	//hide response box
	responseBox.style.display = "none";

	//show final answer container
	var finalAnswerContainerWrapper = document.getElementById("finalAnswerContainerWrapper");
	finalAnswerContainerWrapper.style.display = "block";

	var dividendElement = document.getElementById("dividendElement");
	dividendElement.innerHTML = dividend;


	var divisorElement = document.getElementById("divisorElement");
	divisorElement.innerHTML = divisor;

	var answerElement = document.getElementById("answerElement");
	var finalAnswer = Math.floor(dividend / divisor);
	answerElement.innerHTML = finalAnswer;

	var remainderElement = document.getElementById("remainderElement");
	var finalAnswerRemainder = "R" + dividend % divisor;
	remainderElement.innerHTML = finalAnswerRemainder;

	if (DEBUG) console.log("...Leaving function gameEnd()");
}

function resetGame() {
	window.location.reload();
}