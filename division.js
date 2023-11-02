/* A note about the new 'fixed' version. A lot of thing have been changed to use
 * global state, so we will have the situation where most of the function calls
 * don't actually have any arguments. So it's more of a description of the
 * actions that are going on, even if a function is not called in multiple
 * places (which is where you'd want to break things away into function calls).
 */

// CONTROLLER/VIEW FUNCTIONS

/* You shouldn't need to modify anything here, just add new functions as
 * you see fit.
 */

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
  
  function handleKeyPress(event) {
    if (event.keyCode !== 13) return;
  
    const inputField = document.getElementById('textInput');
    let answer = parseInt(inputField.value);
  
    if (isNaN(answer)) return;
  
    switch (state) {
    case States.ExpectingDivision:
      answerDivision(answer);
      break;
    case States.ExpectingMultiplication:
      answerMultiplication(answer);
      break;
    case States.ExpectingSubtraction:
      answerSubtraction(answer);
      break;
    case States.ExpectingBringDown:
      answerBringDown(answer);
      break;
    case States.ExpectingRemainder:
      answerRemainder(answer);
      break;
    default:
      break;
    }
  }
  
  function displayText(string) {
    const element = document.getElementById('suggestions');
    const content = string.replace(/\b(\d+)\b/g, '<span class="highlight">$1</span>');
    element.innerHTML = content;
  }

  function checkButton(clickedButton) {
    if (clickedButton === state) {
      if (clickedButton === States.ExpectingSubtraction) {
        addSigns();
      }
      announceCorrect();
      console.log("correct button");
      document.getElementById('buttons').style.display = 'none';
      document.getElementById('suggestions').style.display = 'block';
      document.getElementById('textInput').style.display = 'block';
    }
    else {
        announceIncorrect()
        console.log("incorrect button");
        return;
    }
  }

  // QUESTION FUNCTIONS
  
  /* The prompt functions should:
   * - ask the question to the user
   * - also, set up the position of the input text box <-- IMPORTANT!!!
   */

  function questionDivide() {
    displayText("How many times does " + divisor + " go into " + smallDividend + "? ");
  }
  
  function questionMultiply() {
    displayText("What is " + expectedDivide + " times " + divisor + "? ");
  }
  
  function questionSubtract() {
    displayText("What is " + smallDividend + " minus " + expectedMultiply + "? ");
  }
  
  function questionBringDown() {
    displayText("Now bring down the " + expectedBringDown + ". "); 
  }
  
  function questionRemainder() {
    displayText("What's the remainder? ");
  }
  
  /* Tell the player that they are wrong. */
  function announceIncorrect() {
    document.getElementById('textInput').value = '';
    console.log("Incorrect!");
    var element = document.getElementById('iscorrect');
    element.innerHTML = "Incorrect! Try again!";
    setTimeout(function() {
        element.innerHTML = "What's next?";
    }, 4000);
  }
  
  /* Tell the player that they are right. */
  function announceCorrect() {
    document.getElementById('buttons').style.display = 'flex';
    document.getElementById('suggestions').style.display = 'none';
    document.getElementById('textInput').style.display = 'none';
    document.getElementById('textInput').value = '';
    console.log("Correct!");
    var element = document.getElementById('iscorrect');
    element.innerHTML = "Correct! Nice job!";
    setTimeout(function() {
        element.innerHTML = "What's next?";
    }, 4000);
  }
  
  /* this function should handle things like:
   * - clearing all text boxes and other displays
   * - display win graphics/text/sound effects
   * - prompt the player to play again (would be another call to `startGame()`)
   */
  function announceSuccess() {
    console.log("Congratulations! You win!");
    var element = document.getElementById('win');
    var e = document.getElementById('iscorrect');
    element.innerHTML = "Congrats! You Win!";
    setTimeout(function() {
        element.innerHTML = "";
        e.innerHTML = "";
    }, 10000);
  }
  
  
  // DISPLAY FUNCTIONS
  
  /* Display the dividend and divisor at the beginning of the computation. */
  function displayInitialNumbers() {
    // this should already be enough
    document.getElementById('suggestions').style.display = 'none';
    document.getElementById('textInput').style.display = 'none';
    const dividendEl = document.getElementById('dividend');
    const divisorEl = document.getElementById('divisor');
    dividendEl.textContent = dividend;
    divisorEl.textContent = divisor;

    // Loop through dividendEl.textContent and wrap each text item in a <span> element
    let dividendText = '';
    console.log(dividendEl.textContent)
    if (dividendEl.textContent.length === 1) {
      dividendText += `<span style="color: ${'blue'};">${dividendEl.textContent[0]}</span>`;
    }
    if (dividendEl.textContent.length === 2) {
      dividendText += `<span style="color: ${'red'};">${dividendEl.textContent[0]}</span>`;
      dividendText += `<span style="color: ${'blue'};">${dividendEl.textContent[1]}</span>`;
    }
    if (dividendEl.textContent.length === 3) {
      dividendText += `<span style="color: ${'green'};">${dividendEl.textContent[0]}</span>`;
      dividendText += `<span style="color: ${'red'};">${dividendEl.textContent[1]}</span>`;
      dividendText += `<span style="color: ${'blue'};">${dividendEl.textContent[2]}</span>`;
    }
    if (dividendEl.textContent.length === 4) {
      dividendText += `<span style="color: ${'yellow'};">${dividendEl.textContent[0]}</span>`;
      dividendText += `<span style="color: ${'green'};">${dividendEl.textContent[1]}</span>`;
      dividendText += `<span style="color: ${'red'};">${dividendEl.textContent[2]}</span>`;
      dividendText += `<span style="color: ${'blue'};">${dividendEl.textContent[3]}</span>`;
    }
    console.log("dividendText: " + dividendText);

    // Loop through divisorEl.textContent and wrap each text item in a <span> element
    let divisorText = '';
    console.log(divisorEl.textContent)
    if (divisorEl.textContent.length === 1) {
      divisorText += `<span style="color: ${'blue'};">${divisorEl.textContent[0]}</span>`;
    }
    if (divisorEl.textContent.length === 2) {
      divisorText += `<span style="color: ${'red'};">${divisorEl.textContent[0]}</span>`;
      divisorText += `<span style="color: ${'blue'};">${divisorEl.textContent[1]}</span>`;
    }
    if (divisorEl.textContent.length === 3) {
      divisorText += `<span style="color: ${'green'};">${divisorEl.textContent[0]}</span>`;
      divisorText += `<span style="color: ${'red'};">${divisorEl.textContent[1]}</span>`;
      divisorText += `<span style="color: ${'blue'};">${divisorEl.textContent[2]}</span>`;
    }
    if (divisorEl.textContent.length === 4) {
      divisorText += `<span style="color: ${'yellow'};">${divisorEl.textContent[0]}</span>`;
      divisorText += `<span style="color: ${'green'};">${divisorEl.textContent[1]}</span>`;
      divisorText += `<span style="color: ${'red'};">${divisorEl.textContent[2]}</span>`;
      divisorText += `<span style="color: ${'blue'};">${divisorEl.textContent[3]}</span>`;
    }
    console.log("divisorText: " + divisorText);

    dividendEl.innerHTML = dividendText;
    divisorEl.innerHTML = divisorText;

    document.getElementById('quotient').textContent = " ";
    document.getElementById('quotient').textContent += " ".repeat(numDigits(smallDividend ) - 1);
  }
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
   * THE ARGUMENT IS `expectedDivide`!!
   */
  function displayQuotientDigit() {
    // this should already be done
    document.getElementById('quotient').textContent += expectedDivide;
  }

    // ANSWER FUNCTION YO
  function alignAnswer(answer, alignment, bool) {
      var e = document.getElementById('answer');
      e.innerHTML += '\0';
      e.innerHTML += answer.toString().padStart(alignment, " ");
      if (bool) e.innerHTML += '\n';
  }

  function addSigns() {
    var element = document.getElementById('answer');
    answer = element.innerHTML;
    strlen = answer.length;
    for (i = strlen - 1; i >= 0; --i) {
      if (answer[i] === ' ') {
        var ans = answer.substring(0, i) + "<u>-" + answer.substring(i + 1) + "</u>";
        element.innerHTML = ans;
        break;
      }
    }
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
   *
   * THE ARGUMENT IS IN `expectedMultiply`!!
   */
  var j;
  function displayMultiplicationResult() {
    alignAnswer(expectedMultiply, j, true);
    console.log(expectedMultiply);
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
   *
   * THE ARGUMENT IS IN `expectedSubtract`
   */
  function displaySubtractionResult() {
    alignAnswer(expectedSubtract, j, false);
    console.log(expectedSubtract);
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
   * then `pushBringDownDigit(7)` should make things look like
   *       5
   *     _____
   *  7 ) 377
   *      35
   *    - __
   *       27 <- This `7` is new
   *
   * THE ARGUMENT IS IN `expectedBringDown` AND IS ALWAYS A SINGLE DIGIT
   */
  function displayBringDownDigit() {
    document.getElementById('answer').innerHTML += (expectedBringDown + '\n');
    j++;
    console.log(expectedBringDown);
  }
  
  // ANSWERING FUNCTIONS
  
  /* I don't you need to modify anything here. */
  
  function answerDivision(number) {
    if (number == expectedDivide) {
      announceCorrect();
      displayQuotientDigit();
      // next state
      questionMultiply();
      state = States.ExpectingMultiplication;
    } else {
      announceIncorrect();
    }
  }
  
  function answerMultiplication(number) {
    if (number == expectedMultiply) {
      announceCorrect();
      displayMultiplicationResult();
      // go to next state
      questionSubtract();
      state = States.ExpectingSubtraction;
    } else {
      announceIncorrect();
    }
  }
  
  function answerSubtraction(number) {
    if (number == expectedSubtract) {
      announceCorrect();
      displaySubtractionResult();
      // need to determine if there are digits to bring down: change state
      // can either go to:
      // - bring down
      // - remainder
      if (Number.isNaN(effectiveDividend)) {
        expectedRemainder = expectedSubtract;
        state = States.ExpectingRemainder;
        questionRemainder();
      } else {
        state = States.ExpectingBringDown;
        questionBringDown();
      }
    } else {
      announceIncorrect();
    }
  }
  
  function answerBringDown(number) {
    if (number == expectedBringDown) {
      announceCorrect();
      displayBringDownDigit();
      // refresh the state machine
      effectiveDividend = parseInt(expectedSubtract.toString() + effectiveDividend.toString());
      getNextSmallDividend();
      getExpectedResults();
  
      state = States.ExpectingDivision;
      questionDivide();
    } else {
      announceIncorrect();
    }
  }
  
  function answerRemainder(number) {
    if (number == expectedRemainder) {
      document.getElementById('quotient').innerHTML += " <b>R</b> " + expectedRemainder;
      //announceCorrect();
      announceSuccess();
  
      state = undefined;
    } else {
      announceIncorrect();
    }
  }
  
  // MODEL STUFF
  
  /* I don't you need to modify anything here. */
  
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
  
  var dividend, divisor;
  
  var effectiveDividend;
  var smallDividend;
  
  var expectedDivide;
  var expectedMultiply;
  var expectedSubtract;
  var expectedBringDown;
  var expectedRemainder;
  
  function getNextSmallDividend() {
    if (takeDigits(effectiveDividend, numDigits(divisor)) < divisor) {
      smallDividend = takeDigits(effectiveDividend, numDigits(divisor) + 1);
      effectiveDividend = dropDigits(effectiveDividend, numDigits(divisor) + 1);
    } else {
      smallDividend = takeDigits(effectiveDividend, numDigits(divisor));
      effectiveDividend = dropDigits(effectiveDividend, numDigits(divisor));
    }
  }
  
  function getExpectedResults() {
    expectedDivide = Math.floor(smallDividend / divisor);
    expectedMultiply = expectedDivide * divisor;
    expectedSubtract = smallDividend - expectedMultiply;
    expectedBringDown = takeDigits(effectiveDividend, 1);
  }
  
  const States = {
    ExpectingDivision: Symbol("div"),
    ExpectingMultiplication: Symbol("mul"),
    ExpectingSubtraction: Symbol("sub"),
    ExpectingBringDown: Symbol("bdn"),
    ExpectingRemainder: Symbol("rem")
  };
  
  var state;
  
  /* Call this function to generate one new division algorithm to run. */
  function startGame() {
    // hardcoded: no way to customize the range of numbers that get used
    divisor = getRandomInt(20) + 1;
    dividend = divisor * (getRandomInt(75) + 10)
                  + (Math.random() < 0.45 ? getRandomInt(20) : 0);
              // random chance of getting a remainder
  
    effectiveDividend = dividend;
  
    getNextSmallDividend();
    getExpectedResults();
    state = States.ExpectingDivision;
    questionDivide();
    j = numDigits(smallDividend) + 1;
    displayInitialNumbers();
  }
