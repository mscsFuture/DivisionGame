// Function to switch between pages
function switchPage(fromPage, toPage) {
  // Hide the fromPage
  fromPage.style.display = 'none';
  
  // Show the toPage
  toPage.style.display = 'block';
}

// Add event listener to the gameButton
const gameButton = document.getElementById('gameButton');
gameButton.addEventListener('click', function() {
  switchPage(menuPage, gamePage);
  startGame();
});

// VERSION HISTORY
//
// Version 1.2:
// + main game loop is now a function
//
// Version 1.1:
// + added a chance that the division will have a remainder
// + added two-digit divisors
//
// Version 1.0:
// * initial version

// TERMINAL UI SECTION

/* These functions here are a bunch of things required for the terminal
 * implementation of the program. You should delete this once the web UI is
 * complete.
 */

//const prompt = require('prompt-sync')({sigint: true});

var display = ["     "];
var padding = 5;
var number = 0;

function printDisplay() {
  for (let line of display) {
    console.log(line);
  }
}

let answer = -1;

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault(); // Prevent form submission if the input is inside a form
    const inputField = document.getElementById('textInput');
    answer = parseInt(inputField.value);

    if (!isNaN(answer)) {
      // Perform actions with the input value
      console.log("Input value:", answer);

      // Clear the input field
      inputField.value = '';

      // Resolve the promise to break out of the wait loop
      inputField.promiseResolver();
    }
  }
}

function waitForInteger(string) {
  const inputField = document.getElementById('textInput');
  
  // Create a promise to wait for the Enter key press
  const waitForEnterKey = new Promise((resolve) => {
    inputField.promiseResolver = resolve;
  });

  // Add the event listener to the input field
  inputField.addEventListener('keydown', handleKeyPress);

  // Wait until the Enter key is pressed
  waitForEnterKey.then(() => {
    // Remove the event listener once the Enter key is pressed
    inputField.removeEventListener('keydown', handleKeyPress);
  });

  // You can replace the prompt with your own logic to display the input field and get the input from the user
  // For example, you can show a hidden input field and handle the Enter key press event as shown above

  return waitForEnterKey.then(() => answer);
}



function displayText(string) {
  const msgEl = document.getElementById('suggestions');
  const content = string.replace(/\b(\d+)\b/g, '<span class="highlight">$1</span>');
  msgEl.innerHTML = content;
}

// END TERMINAL UI SECTION

/*
 * To my beloved Herman,
 *
 * The following commented functions serve as the method that the divison game
 * will communicate with the game controller. So far they have been given
 * implementations for the command line version. You should reimplement them
 * for use with the web UI.
 *
 * In general the prompt functions should reject an invalid input (an input
 * that is not an integer) but should still return in the case that the input is
 * valid, but incorrect. The main game loop will recall any functions if the
 * input is incorrect. (Thus, the functions do not need to know the expected
 * answer, even though it can easily compute it itself.)
 *
 * Best wishes,
 * Matthew
 */

/*
 * Prompt the user asking if they would like to play again. Called following
 * the completion of a full round of division.
 *
 * Return: boolean with the user's response
 */
function promptReplay() {
  return prompt("Want to play again? ") != "no";
}

/*
 * Prompt the user with the question "How many times does `x` go into `y`?" and
 * get their response.
 *
 * Return: integer with the user's response
 */
function promptDivide(x, y) {
  displayText("How many times does " + x + " go into " + y + "? ");
  return waitForInteger("How many times does " + x + " go into " + y + "? ");
}

/*
 * Prompt the user with the question "What is `x` times `y`?" and get their
 * response.
 *
 * Return: integer with the user's response
 */
function promptMultiply(x, y) {
  displayText("What is " + x + " times " + y + "? ");
  return waitForInteger("What is " + x + " times " + y + "? ");
}

/*
 * Prompt the user with the question "What is `x` minus `y`?" and get their
 * response.
 *
 * Return: integer with the user's response
 */
function promptSubtract(x, y) {
  displayText("What is " + x + " minus " + y + "? ");
  return waitForInteger("What is " + x + " minus " + y + "? ");
}

/*
 * Prompt the user with the statement "Now bring down the `x`" and get their
 * response.
 *
 * Return: integer with the user's response
 */
function promptBringDown(x) {
  displayText("Now bring down the " + x + ". ");
  return waitForInteger("Now bring down the " + x + ". ");
}

/*
 * Ask the user what the remainder of the division is at the end.
 *
 * Return: integer with the user's response
 */
function promptRemainder() {
  displayText("What's the remainder? ");
  return waitForInteger();
}

/*
 * Announce to the user that their most recent entry was incorrect.
 */
function announceIncorrect() {
  console.log("Incorrect!");
}

/*
 * Announce to the user that their most recent entry was correct.
 */
function announceCorrect() {
  console.log("Correct!");
}

/*
 * Tell the user that they have successfully completed the division process.
 */
function announceSuccess() {
  console.log("Congratulations! You win!");
}

/*
 * Set the initial state of the division by giving the dividend and divisor that
 * they will be working with.
 */
function displayInitialNumbers(dividend, divisor) {
  // reset state
  /*
  display = ["     "];
  padding = 5;
  // put new numbers
  display[1] = "    _______";
  display[2] = " " + divisor + (numDigits(divisor) == 2 ? "" : " ")
  display[2] += ") " + dividend;
  printDisplay();
  */
  const dividendEl = document.getElementById('dividend');
  const divisorEl = document.getElementById('divisor');
  dividendEl.textContent = dividend;
  divisorEl.textContent = divisor;
}

/* These functions all modify the internal state (which is the current student
 * progress into figuring out the answer) of the divison process. Modifications
 * of the internal state should be visible to the user as they are made.
 *
 * To simplify implementation of the display mechanics, you can assume the
 * functions will always be called in the following order (in a cycle):
 * 1. `pushQuotientDigit`
 * 2. `pushMultiplicationResult`
 * 3. `pushSubtractionResult`
 * 4. `bringDownDigit`
 * The cycle will terminate after a call to `pushSubtractionResult` which
 * happens if there are no more digits to drop down (and the division is
 * complete).
 */

/*
 * Pushes a digit to the existing portion of the quotient that is visible to
 * the user.
 *
 * If the current state of the division looks like
 *       5
 *     _____
 *  7 ) 357
 * then `pushQuotientDigit(1)` should make things look like
 *       51   <- This `1` is new
 *     _____
 *  7 ) 357
 *
 * digit: single digit to display
 */
function pushQuotientDigit(digit) {
  display[0] += digit;
  //printDisplay();
}

/*
 * Pushes a number that results from the multiplication of the quotient digit
 * with the divisor.
 *
 * If the current state of the division looks like
 *       5
 *     _____
 *  7 ) 377
 * then `pushMultiplicationResult(35)` should make things look like
 *       5
 *     _____
 *  7 ) 377
 *      35  <- This is new
 * This function will never be called after a call to
 * `pushMultiplicationResult` or `pushSubtractionResult`, so that the result
 * can easily be positioned.
 *
 * number: number to display
 */
function pushMultiplicationResult(number) {
  display.push(" ".repeat(padding) + number);
  display.push(" ".repeat(padding - 1) + "-" + "_".repeat(number.toString().length));
  //printDisplay();
}

/*
 * Pushes a number that results from the subtraction of the effective dividend
 * with the previous multiplication result.
 *
 * If the current state of the division looks like
 *       5
 *     _____
 *  7 ) 377
 *      35
 * then `pushSubtractionResult(2)` should make things look like
 *       5
 *     _____
 *  7 ) 377
 *      35
 *    - __
 *       2  <- This is new
 * This function will always be called after a call to
 * `pushMultiplicationResult`, so that the number can be well positioned
 * underneath.
 *
 * number: number to display
 */
function pushSubtractionResult(number) {
  padding += 2 - numDigits(number);
  display.push(" ".repeat(padding) + number);
  //printDisplay();
}

/*
 * Pushes a number to the end of the subtraction result that comes from the
 * action of dropping down the next digit.
 *
 * If the current state of the division looks like
 *       5
 *     _____
 *  7 ) 377
 *      35
 *    - __
 *       2
 * then `pushSubtractionResult(7)` should make things look like
 *       5
 *     _____
 *  7 ) 377
 *      35
 *    - __
 *       27 <- This `7` is new
 * This function will always be called after a call to
 * `pushSubtractionResult`, so that the new digit can be positioned next to that
 * previous subtraction result.
 *
 * digit: single digit to display
 */
function bringDownDigit(digit) {
  display[display.length - 1] += digit;
  //printDisplay();
}

// END API

// This section has all the code for the model. Don't touch it!

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function takeDigits(num, n) {
  return parseInt(num.toString().substring(0, n))
}

function dropDigits(num, n) {
  return parseInt(num.toString().substring(n));
}

function numDigits(num) {
  return num.toString().length;
}

// main thread
function startGame() {
  do {
    // hardcoded: no way to customize the range of numbers that get used
    let divisor = getRandomInt(20) + 1;
    let dividend = divisor * (getRandomInt(75) + 10)
                  + (Math.random() < 0.45 ? getRandomInt(20) : 0);
              // random chance of getting a remainder

    let effectiveDividend = dividend;

    displayInitialNumbers(dividend, divisor);

    while (true) {
      // this does an extra computation to determine if it must be division into
      // two digits (??)
      // hardcoded: will not work with 2 digit divisors
      if (takeDigits(effectiveDividend, numDigits(divisor)) < divisor) {
        var smallDividend = takeDigits(effectiveDividend, numDigits(divisor) + 1);
        effectiveDividend = dropDigits(effectiveDividend, numDigits(divisor) + 1);
      } else {
        var smallDividend = takeDigits(effectiveDividend, numDigits(divisor));
        effectiveDividend = dropDigits(effectiveDividend, numDigits(divisor));
      }

      const expectedDivide = Math.floor(smallDividend / divisor);
      while (promptDivide(divisor, smallDividend) != expectedDivide) {
        // can add more logic to track how many times student is incorrect here
        announceIncorrect();
      }
      // correct: add to top
      announceCorrect();
      pushQuotientDigit(expectedDivide);

      const expectedMultiply = expectedDivide * divisor;
      while (promptMultiply(expectedDivide, divisor) != expectedMultiply) {
        // can add more logic to track how many times student is incorrect here
        announceIncorrect();
      }
      // correct: multiply
      announceCorrect();
      pushMultiplicationResult(expectedMultiply);

      const expectedSubtract = smallDividend - expectedMultiply;
      while (promptSubtract(smallDividend, expectedMultiply) != expectedSubtract) {
        // can add more logic to track how many times student is incorrect here
        announceIncorrect();
      }
      // correct: subtract
      announceCorrect();
      pushSubtractionResult(expectedSubtract);

      // flawed time to enforce loop invariant
      if (Number.isNaN(effectiveDividend)) {
        var remainder = expectedSubtract;
        break;
      }

      const expectedBringDown = takeDigits(effectiveDividend, 1);
      while (promptBringDown(expectedBringDown) != expectedBringDown) {
        // can add more logic to track how many times student is incorrect here
        announceIncorrect();
      }
      // correct: subtract
      announceCorrect();
      bringDownDigit(expectedBringDown);

      effectiveDividend = parseInt(expectedSubtract.toString() + effectiveDividend.toString());
    }

    // check remainder knowledge
    while (promptRemainder() != remainder) {
      // can add more logic to track how many times student is incorrect here
      announceIncorrect();
    }
    // correct: subtract
    announceCorrect();

    announceSuccess();

  } while (promptReplay());
}