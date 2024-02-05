/* A note about the new 'fixed' version. A lot of thing have been changed to use
 * global state, so we will have the situation where most of the function calls
 * don't actually have any arguments. So it's more of a description of the
 * actions that are going on, even if a function is not called in multiple
 * places (which is where you'd want to break things away into function calls).
 */

// CONTROLLER/VIEW FUNCTIONS
// ============================================================================================================================

// Button listeners, switching display pages, handling key presses, accepting text input, displaying certain text

/* You shouldn't need to modify anything here, just add new functions as
 * you see fit.
 */

// Function to switch between pages
function switchPage(fromPage, toPage) {
    // Hide the fromPage
    fromPage.style.display = 'none';
  
    // Show the toPage
    toPage.style.display = 'block';

    console.log("switched pages");
  }
  
  // Add event listener to the gameButton
  const gameButton = document.getElementById('gameButton');
  gameButton.addEventListener('click', function() {   // when the game button is clicked:
    switchPage(menuPage, gamePage);   // switch the pages
    startGame();                      // start the game
    console.log("button to start game pressed");
  });
  
  // handles when text is input and 'enter' is pressed (enter is keycode 13)
  function handleKeyPress(event) {
    if (event.keyCode !== 13) return;
  
    const inputField = document.getElementById('textInput');
    let answer = parseInt(inputField.value);
  
    if (isNaN(answer)) return;  // if text input is not a number, don't do anything

    console.log("valid text input entered");
    
    // depending on the state of the game, activates the corresponding answer function passing the answer that was entered
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
  
  // displays the suggestions above the text input box (Ex. "what is the remainder?"")
  function displayText(string) {
    const element = document.getElementById('suggestions');
    const content = string.replace(/\b(\d+)\b/g, '<span class="highlight">$1</span>');
    element.innerHTML = content;
    console.log("suggetsion displayed");
  }

  // listens for a button to be clicked on the game page (divide, multiply, etc)
  function checkButton(clickedButton) {
    if (clickedButton === state) {                                         // if the correct game page button is pressed
      if (clickedButton === States.ExpectingSubtraction) {                 // add the minus sign if the state is subtraction
        addSigns();
      }
      announceCorrect();                                                   // announce that the user is correct
      console.log("correct button pressed on game page");                        
      document.getElementById('buttons').style.display = 'none';           // hide all the buttons on the game page
      document.getElementById('suggestions').style.display = 'block';      // show the suggestion for what to enter in the text box
      document.getElementById('textInput').style.display = 'block';        // show the text input box itself
    }
    else {                                                                 // if the incorrect game page button is pressed
        announceIncorrect()                                                // announce that the user is incorrect
        console.log("incorrect button pressed on game page");            
        return;
    }
  }

  // define the 'yes button'
  const yesButton = document.getElementById('yesButton');
  yesButton.addEventListener('click', function() {    // if yes button is clicked
      restartGame();                                  // restart the game
  });

  // define the 'play again button'
  const playAgain = document.getElementById('endedPlayAgain');
  playAgain.addEventListener('click', function() {    // if play again button is clicked
      restartGame();                                  // restart the game
  });
  
  // define the 'no button' NO BUTTON IS NOW THE RECAP BUTTON
  const noButton = document.getElementById('noButton');
  noButton.addEventListener('click', function() {     // if the no button is clicked
      switchPage(gamePage, gameEndPage);                                
      var element = document.getElementById('problemsText');
      var dividend = document.getElementById('dividend');
      var divisor = document.getElementById('divisor');

      let dividendText = '';
      let divisorText = '';

      // add color coordinating to the dividend text on the recap page
      if (dividend.textContent.length === 1) {
        dividendText += `<span style="color: #1b07f2;">${dividend.textContent[0]}</span>`
      }
      if (dividend.textContent.length === 2) {
        dividendText += `<span style="color: #8200d9;">${dividend.textContent[0]}</span>`
        dividendText += `<span style="color: #1b07f2;">${dividend.textContent[1]}</span>`
      }
      if (dividend.textContent.length === 3) {
        dividendText += `<span style="color: #da0088;">${dividend.textContent[0]}</span>`
        dividendText += `<span style="color: #8200d9;">${dividend.textContent[1]}</span>`
        dividendText += `<span style="color: #1b07f2;">${dividend.textContent[2]}</span>`
      }
      if (dividend.textContent.length === 4) {
        dividendText += `<span style="color: #e60031;">${dividend.textContent[0]}</span>`
        dividendText += `<span style="color: #da0088;">${dividend.textContent[1]}</span>`
        dividendText += `<span style="color: #8200d9;">${dividend.textContent[2]}</span>`
        dividendText += `<span style="color: #1b07f2;">${dividend.textContent[3]}</span>`
      }

      // add color to the divisor text on the recap page
      if (divisor.textContent.length === 1) {
        divisorText += `<span style="color: #1b07f2;">${divisor.textContent[0]}</span>`
      }
      if (divisor.textContent.length === 2) {
        divisorText += `<span style="color: #8200d9;">${divisor.textContent[0]}</span>`
        divisorText += `<span style="color: #1b07f2;">${divisor.textContent[1]}</span>`
      }

      // display a recap of the problem that was just solved
      element.innerHTML = "Dividend: " + dividendText 
        + '\n' + "Divisor: " + divisorText
        + '\n' + "Quotient: " + quotient.innerHTML.toString().substring(0, quotient.innerHTML.toString().length - 47) 
        + '\n' + "Remainder: " + `<span style="color: ${'orange'}">${expectedRemainder}</span>`;
      console.log("Displayed problem recap page");
  });
    
  // function to restart the game, it does this by reloading the page
  function restartGame() {
    location.reload();
  }

  // QUESTION FUNCTIONS
  // ============================================================================================================================

  // display question text, functions to handle correct and incorrect input, end of game functionality

  /* The prompt functions should:
   * - ask the question to the user
   * - also, set up the position of the input text box <-- IMPORTANT!!!
   */

  function questionDivide() {
    displayText("How many times does " + divisor + " go into " + smallDividend + "? ");   // display division question
  }
  
  function questionMultiply() {
    displayText("What is " + expectedDivide + " times " + divisor + "? ");    // display multiplication question
  }
  
  function questionSubtract() {
    displayText("What is " + smallDividend + " minus " + expectedMultiply + "? ");    // display subtraction question
  }
  
  function questionBringDown() {
    displayText("Now bring down the " + expectedBringDown + ". ");    // display bringing down a digit question
  }
  
  function questionRemainder() {
    displayText("What's the remainder? ");    // display the remainder question
  }

  // these variables keep track of the time out functions used in the announceCorrect and announceIncorrect functions\
  // this allows them to later be cleared so that the correct message is displayed at the correct time and the function
  // does not activate outside of the scope of when it should
  var correctTimeout1;    
  var incorrectTimeout1;
  
  /* Tell the player that they are wrong. */
  function announceIncorrect() {
    document.getElementById('textInput').value = '';
    console.log("Incorrect!");
    var element = document.getElementById('iscorrect');   // get 'iscorrect' element
    clearTimeout(correctTimeout1);                        // clear any previous correct messages that have not yet been displayed
    clearTimeout(incorrectTimeout1);                      // clear any previous incorrect messages that have not yet been displayed
    
    element.innerHTML = "Incorrect! Try again!";          // set the displayed message
    incorrectTimeout1 = setTimeout(function() {           // after 3 seconds (3000):
      element.innerHTML = "What's next?";                 // change the message again
    }, 2000);
    
  }
  
  /* Tell the player that they are right. */
  function announceCorrect() {
    document.getElementById('buttons').style.display = 'flex';
    document.getElementById('suggestions').style.display = 'none';
    document.getElementById('textInput').style.display = 'none';
    document.getElementById('textInput').value = '';
    console.log("Correct!");
    var element = document.getElementById('iscorrect');   // get 'iscorrect' element
    clearTimeout(correctTimeout1);                        // clear any previous correct messages that have not yet been displayed
    clearTimeout(incorrectTimeout1);                      // clear any previous incorrect messages that have not yet been displayed
    
    element.innerHTML = "Correct! Nice job!";             // set the displayed message
    correctTimeout1 = setTimeout(function() {             // after 3 seconds (3000):
      if (state != States.Success) {                      // only change the message if the game is not in the success state meaning it ended
        element.innerHTML = "What's next?";               // change the message again if not in success state
      }
    }, 2000);
  }

  // these buttons are used by the user to select whether or not they want to play again at the end of the game
  // originally they are set to be invisible until the end of the game
  document.getElementById('noButton').style.display = 'none';
  document.getElementById('yesButton').style.display = 'none';
  
  /* this function should handle things like:
   * - clearing all text boxes and other displays
   * - display win graphics/text/sound effects
   * - prompt the player to play again (would be another call to `startGame()`)
   */
  function announceSuccess() {
    console.log("Congratulations! You win! (success, game ended)");
    
    state = States.Success;                               // set the state to be success        

    clearTimeout(correctTimeout1);                        // clear any previous correct messages that have not yet been displayed
    clearTimeout(incorrectTimeout1);                      // clear any previous incorrect messages that have not yet been displayed
    var element = document.getElementById('iscorrect');   // get 'iscorrect' element
    var again = document.getElementById('playagain');     // get the element to display the playing again message

    element.innerHTML = "Congrats! You Win!";             // set the displayed message
    

    setTimeout(function() {                                             // after 8 seconds (8000)
        element.innerHTML = "";                                         // set the current display to be nothing (invisible)
        again.innerHTML = "Would you like to play again?";              // set the message to ask the user about playing again
        document.getElementById('noButton').style.display = 'block';    // show 'no button'
        document.getElementById('yesButton').style.display = 'block';   // show 'yes button'
    }, 8000);
  }
  
  // DISPLAY FUNCTIONS
  // ============================================================================================================================

  // display the dividend/divisor, display the quotient digits, display the mult. and sub. results that go under the 
  // division bar, align text on the screen, display the digits that get brought down
  
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
      dividendText += `<span style="color: #1b07f2;">${dividendEl.textContent[0]}</span>`;
    }
    if (dividendEl.textContent.length === 2) {
      dividendText += `<span style="color: #8200d9;">${dividendEl.textContent[0]}</span>`;
      dividendText += `<span style="color: #1b07f2;">${dividendEl.textContent[1]}</span>`;
    }
    if (dividendEl.textContent.length === 3) {
      dividendText += `<span style="color: #da0088;">${dividendEl.textContent[0]}</span>`;
      dividendText += `<span style="color: #8200d9;">${dividendEl.textContent[1]}</span>`;
      dividendText += `<span style="color: #1b07f2;">${dividendEl.textContent[2]}</span>`;
    }
    if (dividendEl.textContent.length === 4) {
      dividendText += `<span style="color: #e60031;">${dividendEl.textContent[0]}</span>`;
      dividendText += `<span style="color: #da0088;">${dividendEl.textContent[1]}</span>`;
      dividendText += `<span style="color: #8200d9;">${dividendEl.textContent[2]}</span>`;
      dividendText += `<span style="color: #1b07f2;">${dividendEl.textContent[3]}</span>`;
    }
    console.log("dividendText: " + dividendText);

    // Loop through divisorEl.textContent and wrap each text item in a <span> element
    let divisorText = '';
    console.log(divisorEl.textContent)
    if (divisorEl.textContent.length === 1) {
      divisorText += `<span style="color: #1b07f2;">${divisorEl.textContent[0]}</span>`;
    }
    if (divisorEl.textContent.length === 2) {
      divisorText += `<span style="color: #8200d9;">${divisorEl.textContent[0]}</span>`;
      divisorText += `<span style="color: #1b07f2;">${divisorEl.textContent[1]}</span>`;
    }
    if (divisorEl.textContent.length === 3) {
      divisorText += `<span style="color: #da0088;">${divisorEl.textContent[0]}</span>`;
      divisorText += `<span style="color: #8200d9;">${divisorEl.textContent[1]}</span>`;
      divisorText += `<span style="color: #1b07f2;">${divisorEl.textContent[2]}</span>`;
    }
    if (divisorEl.textContent.length === 4) {
      divisorText += `<span style="color: #e60031;">${divisorEl.textContent[0]}</span>`;
      divisorText += `<span style="color: #da0088;">${divisorEl.textContent[1]}</span>`;
      divisorText += `<span style="color: #8200d9;">${divisorEl.textContent[2]}</span>`;
      divisorText += `<span style="color: #1b07f2;">${divisorEl.textContent[3]}</span>`;
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
    var quotient = document.getElementById('quotient');
    let quotientText = '';
    
    // displays the quotient text in the correct color coordination based on how long it is
    // the quotient text's length starts as the same length as the dividend 
    // (if the dividend is 1014, the quotient text's length will be 4 and will increase from there to 5)
    // since no dividends have a length of 1, the if statement to include 1 can be skipped
    if (quotient.textContent.length === 2) {
      quotientText += `<span style="color: #8200d9;">${quotient.textContent[0]}</span>`;
      quotientText += `<span style="color: #1b07f2;">${quotient.textContent[1]}</span>`;
    }
    if (quotient.textContent.length === 3) {
      quotientText += `<span style="color: #da0088;">${quotient.textContent[0]}</span>`;
      quotientText += `<span style="color: #8200d9;">${quotient.textContent[1]}</span>`;
      quotientText += `<span style="color: #1b07f2;">${quotient.textContent[2]}</span>`;
    }
    if (quotient.textContent.length === 4) {
      quotientText += `<span style="color: #e60031;">${quotient.textContent[0]}</span>`;
      quotientText += `<span style="color: #da0088;">${quotient.textContent[1]}</span>`;
      quotientText += `<span style="color: #8200d9;">${quotient.textContent[2]}</span>`;
      quotientText += `<span style="color: #1b07f2;">${quotient.textContent[3]}</span>`;
    }
    // this if statement handles a special case where the quotient text is longer than 4
    // this happens if the dividend is 4 digits long since it will increase to 5
    // if functionality to increase the number of digits in the dividend beyond 4 is implemented, more if statements to handle lengths above 5
    // will need to be added
    if (quotient.textContent.length === 5) {    
      quotientText += `<span style="color: #e60031;">${quotient.textContent[1]}</span>`;
      quotientText += `<span style="color: #da0088;">${quotient.textContent[2]}</span>`;
      quotientText += `<span style="color: #8200d9;">${quotient.textContent[3]}</span>`;
      quotientText += `<span style="color: #1b07f2;">${quotient.textContent[4]}</span>`;
    }

    console.log(quotientText, "quotient text after adding color to it");
    quotient.innerHTML = quotientText;
    console.log(quotient.innerHTML, "quotient text element after setting it to have color");
  }

  // this keeps track of what step of the division it is on
  // step 1 is the first number after the first multiplication
  // step 2 is the second number after the first subtraction
  // step 3 is the third number after the second multiplication
  // step 4 is the fourth number after the second subtraction
  // even steps are subtraction and odd steps are multiplication
  var stepNum;         
  
  // this tracks the total number of digits in the dividend and is necessary for determining the color of things
  var totalDigits;

  // aligns the text and colors it correctly to be color coordinated with the colomn of the place number it is in (Ex. tens place is blue hundreds is red)
  // the parameter 'allignment' starts at the same number as the number of digits in the dividend and increases by one each next line down
  function alignAnswer(answer, alignment, bool) {
      var e = document.getElementById('answer');
      e.innerHTML += '\0';

      var alignText = " ";
      var digits = answer.toString().split('');
      
      // STEP ONE
      if (stepNum === 0) {                                                                
        if (totalDigits === 4) {                                                          
          if (answer.toString().length === 3) {                                           // if the dividend has 4 digits and display text has 3 digits
            alignText += `<span style="color: #e60031;">${digits[0]}</span>`;
            alignText += `<span style="color: #da0088;">${digits[1]}</span>`;
            alignText += `<span style="color: #8200d9;">${digits[2]}</span>`;
          }
          if (answer.toString().length === 2) {                                           // if the dividend has 4 digits and display text has 2 digits
            alignText += `<span style="color: #da0088;">${digits[0]}</span>`;
            alignText += `<span style="color: #8200d9;">${digits[1]}</span>`;
          }
        }
        if (totalDigits === 3) {
          if (answer.toString().length === 2) {                                           // if the dividend has 3 digits and display text has 2 digits
            alignText += `<span style="color: #da0088;">${digits[0]}</span>`;
            alignText += `<span style="color: #8200d9;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 3 digits and the display text has 1 digit
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
          }
        }
        if (totalDigits === 2) {                                                          // if the dividend has 2 digits display text can only have 1 digit
          alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
        }
        
      }
      // STEP TWO
      // step two changes how many digits each answer can have since things will have been subtracted
      if (stepNum === 1) {
        if (totalDigits === 4) {
          if (answer.toString().length === 2) {                                           // if the dividend has 4 digits and display text has 2 digits
            alignText += `<span style="color: #da0088;">${digits[0]}</span>`;
            alignText += `<span style="color: #8200d9;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 4 digits and the display text has 1 digit
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
          }
        }
        if (totalDigits === 3) {  
          if (answer.toString().length === 2) {                                           // if the dividend has 3 digits and display text has 2 digits
            alignText += `<span style="color: #da0088;">${digits[0]}</span>`;
            alignText += `<span style="color: #8200d9;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 3 digits and display text has 1 digit
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
          }
        }
        if (totalDigits === 2) {                                                          // if the dividend has 2 digits again display text can only have 1 digit
          alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
        }
      }
      // STEP THREE
      // again changes how many digits can be in an answer
      if (stepNum === 2) {
        if (totalDigits === 4) {
          if (answer.toString().length === 3) {                                           // if the dividend has 4 digits and display text has 3 digits
            alignText += `<span style="color: #da0088;">${digits[0]}</span>`;
            alignText += `<span style="color: #8200d9;">${digits[1]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[2]}</span>`;
          }
          if (answer.toString().length === 2) {                                           // if the dividend has 4 digits and display text has 2 digits
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 4 digits and display text has 1 digit
            alignText += `<span style="color: #1b07f2;">${digits[0]}</span>`;
          }
        }
        if (totalDigits === 3) {
          if (answer.toString().length === 3) {                                           // if the dividend has 3 digits and display text has 3 digits
            alignText += `<span style="color: #da0088;">${digits[0]}</span>`;
            alignText += `<span style="color: #8200d9;">${digits[1]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[2]}</span>`;
          }
          if (answer.toString().length === 2) {                                           // if the dividend has 3 digits and display text has 2 digits
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 3 digits and display text has 1 digit
            alignText += `<span style="color: #1b07f2;">${digits[0]}</span>`;
          }
        }
        if (totalDigits === 2) {                                                          // if the dividend has 2 digits and display text has 2 digits
          if (answer.toString().length === 2) {
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 2 digits and display text has 1 digit
            alignText += `<span style="color: #1b07f2;">${digits[0]}</span>`;
          }
        }
      }
      // STEP FOUR
      // again the number of digits that a display text can have will change (this will be the remainder and can have 1 or 2 digits)
      if (stepNum === 3) {
        if (totalDigits === 4) {
          if (answer.toString().length === 2) {                                           // if the dividend has 4 digits and display text has 2 digits
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 4 digits and display text has 1 digit
            alignText += `<span style="color: #1b07f2;">${digits[0]}</span>`;
          }
        }
        if (totalDigits === 3) {                                                
          if (answer.toString().length === 2) {                                           // if the dividend has 3 digits and display text has 2 digits
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 3 digits and display text has 1 digit
            alignText += `<span style="color: #1b07f2;">${digits[0]}</span>`; 
          }
        }
        if (totalDigits === 2) {
          if (answer.toString().length === 2) {                                           // if the dividend has 2 digits and display text has 2 digits
            alignText += `<span style="color: #8200d9;">${digits[0]}</span>`;
            alignText += `<span style="color: #1b07f2;">${digits[1]}</span>`;
          }
          if (answer.toString().length === 1) {                                           // if the dividend has 2 digits and display text has 1 digit
            alignText += `<span style="color: #1b07f2;">${digits[0]}</span>`;
          }
        }
      }
      console.log(alignment, "alignment");
      
      e.innerHTML += alignText.toString().padStart((alignText.toString().length) + alignment, " ");
      // if a digit is going to be brought down, make a new line in the text string that displays under the division symbol
      if (bool) {           
        e.innerHTML += '\n';
      }
      stepNum ++; // increase the step number each time thsi function is called since the next time it's called it will be the next step
      console.log(e.innerHTML, "answer HTML string");
  }

  var timesAddSigns = 0;  // keeps track of the number of times a the addsigns function has been used

  function addSigns() {
    var element = document.getElementById('answer');                        // answer element
    answer = element.innerHTML;                                             // answer element's inner HTML
    strlen = answer.length;                                                 // length of answer
    console.log(answer, "answer that we need to put the signs around");
    console.log(strlen, "length of answer string");

    var ans;
    // if its the first time we are adding signs, just add them around the answer string since it is the only thing in 
    // answer's inner HTML
    // this will only happen once throughout the course of a game
    if (timesAddSigns === 0) {                                              
      ans = `<u>-` + answer.substring(1, strlen) + `</u>`;
      element.innerHTML = ans;
      timesAddSigns += 1;
    }
    // if it is not the first time we are adding the subtraction sign:
    else {
      var numDigitsInSubtract = expectedMultiply.toString().length;
      console.log(numDigitsInSubtract, "number of digits in the number being subtracted");
      var i = strlen;             // length of total inner HTML element string
      var numSpaces = 0;          // number of spaces we have found in the string
      var iterateTo = 2;          // the number of spaces we need to iterate to depending on the number of digits in the element we are adding the sign to

      // what each digit looks like in the HTML element string is different base on how many digits are in the string
      // for example if the number we need to add the subtraction sign to is 126, the HTML string will look like:
      // <span style="color: green">1</span><span style="color: red">2</span><span style="color: blue">6</span>
      // if the number is 42 it will look like:
      // <span style="color: green">4</span><span style="color: red">2</span>
      // the difference in length determines how many spaces will be in each full number's element string
      // if there are 3 digits there will be 6 spaces, 2 digits will have 4
      // this is why these if statements below determine how many 'spaces' we need to iterate through

      // iterateTo starts at 2 because it there is only one digit, there will be two spaces and there will always be at least one digit
      if (numDigitsInSubtract === 2) {      // if 2 digits, 4 spaces
        iterateTo = 4;
      }
      if (numDigitsInSubtract === 3) {      // if 3 digits, 6 spaces
        iterateTo = 6;
      }
      while (numSpaces < iterateTo) {       // while the number of spaces found is less than the number of spaces we are iterating to:
        if (answer[i] === ' ')
          numSpaces += 1;
        i -= 1;                             // step through the string backwards from the end since this will be the most recent number and the one we will add the subtraction sign to
      }
      // when the iteration is finished it will be on the character right behind the final space we found
      // we need to go back another 4 characters to be in front of the full number in the string
      i -= 4;                               
      console.log(answer[i], "answer[i]");
      // now we can wrap the entire number in the underline and subtraction sign
      ans = answer.substring(0, i - 1) + `<u>-` + answer.substring(i, strlen) + `</u>`;
      console.log(ans, "ans");
      element.innerHTML = ans;
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
  var offset;                 // keeps track of how far to the right the next digit will be aligned
  var firstMultiply = 0;      // keeps track of whether or not this is the first time a mult. result is displayed
  var firstSubtract = 0;      // keeps track of whether or not this is the first time a sub. result is displayed
  var firstExpSub = 0;        // keeps track of what the first sub. result was
  var firstExpMult = 0;       // keeps track of what the first mult. result was
  // storing the results of the first mult. result and sub. result are useful for determing where the next thing below it should go
  // since the scope of the numbers used in this game is small enough, we only need to store the first result
  // if the scope was changed to include more numbers, a mechanism for storing the second or third mult. and sub. results may be needed

  // displays the result of a multiplication
  function displayMultiplicationResult() {
    console.log(offset, "alignment offset before any checks to move it"); 
    console.log(firstExpSub, "first exp sub");
    // checks to move the offset:

    // if it is the first mult. result, and length of the mult. result is 1, but the length of the dividend is greater than 2
    if (firstMultiply === 0 && expectedMultiply.toString().length === 1 && dividend.toString().length != 2) {
      offset ++;
    }
    // if it is the first mult. result, and the length of the mult. result is 2, but the length of the dividend is 4
    else if (firstMultiply === 0 && expectedMultiply.toString().length === 2 && dividend.toString().length === 4) {
      offset ++;
    }
    // if the length of the mult. result is 1 and the length of the thing subtracted (above it) is 2
    else if (expectedMultiply.toString().length === 1 && expectedSubtract.toString().length === 2) {
      offset ++;
    }
    // if the length of the mult. result is 1, and something has been brought down
    else if (expectedMultiply.toString().length === 1 && firstBringDown === 1) {
      offset ++;
    }
    // if the first sub. result has 2 digits plus 1 digit brough down for 3, and the mult. result has 2 digits
    else if (firstExpSub.toString().length === 2 && firstBringDown === 1 && expectedMultiply.toString().length === 2) {
      offset ++;
    }
    // if the length of the mult. result is 1, and the length of the thing subtracted (above it) is 3
    else if (expectedMultiply.toString().length === 1 && expectedSubtract.toString().length === 3) {
      offset += 2;
    }
    if (firstMultiply === 0) {              // if it is the first time there is a mult. result displayed
      firstExpMult = expectedMultiply;      // store what that result is
      firstMultiply ++;                     // change the tracking variable to not be the first time
    }
    console.log(offset, "alignment offset after checks to move it"); 
    
    alignAnswer(expectedMultiply, offset, true);    // display the answer
    console.log(expectedMultiply, "the expected multiplication value was entered");
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
    console.log(offset, "alignment offset before any checks to move it");
    console.log(offset, "offset at start");
    // checks to move the offset:
    // if the sub. result has a length of 1, and the mult. result (above it) has a length of 2
    if (expectedSubtract.toString().length === 1 && expectedMultiply.toString().length === 2) {
      offset ++;
    }
    // if the sub. result has a length of 2, and the mult. result (above it) has a length of 3
    if (expectedSubtract.toString().length === 1 && expectedMultiply.toString().length ===3) {
      offset += 2;
    }
    // if the sub. result has a length of 2, and the mult. result (above it) has a length of 3
    if (expectedSubtract.toString().length === 2 && expectedMultiply.toString().length === 3) {
      offset ++;
    }
    // if, on the second time performing the subtraction, the sub. result is 1 digit longer than the previous mult. result
    if (firstSubtract === 1 && expectedSubtract.toString().length === 2 && expectedMultiply.toString().length === 1) {
      offset = offset - 1;
    }
    if (firstSubtract === 0) {            // if this is the first subtraction being displayed
      firstExpSub = expectedSubtract;     // store the first subtraction
      firstSubtract ++;                   // change the variable so it is no longer the first subtraction
    }

    console.log(offset, "offset after checks");

    console.log(offset, "alignment offset after checks to move it");

    alignAnswer(expectedSubtract, offset, false);   // display the sub. result
    console.log(expectedSubtract, "the expected subtraction value was entered");
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
  document.getElementById('downArrow').style.display = 'none';
  var firstBringDown = 0;   // keeps track of whether this is the first time a digit has been brought down or not
  function displayBringDownDigit() {
    var e = document.getElementById('downArrow');   // variable for the down arrow
    // 51.65%
    // the down arrow is pre-positioned for the dividend having 3 digits so we only need to change it if the dividend has 2 or 4 digits
    if (dividend.toString().length === 2) {   // if dividend has 2 digits, move arrow to the left
      e.style.left = '48.65%';
    }
    if (dividend.toString().length === 4) {   // if dividend has 4 digits, move arrow to the right
      e.style.left = '54.65%';
    }
    
    console.log(offset, "offset for alignment");
    document.getElementById('answer').innerHTML += (`<span style="color: #1b07f2;">${expectedBringDown}</span>` + '\n');
    document.getElementById('downArrow').style.display = 'block';
    firstBringDown = 1;   // change this to one since it will no longer be the first time this is called
    console.log(expectedBringDown, "the expected bring down digit was entered");
  }
  
  // ANSWERING FUNCTIONS
  // ============================================================================================================================
  
  // functions to handle when the user inputs answers to the text input 

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
      var remainderText = '';
      remainderText += `<span style="color: ${'orange'};">${expectedRemainder}</span>`
      
      
      document.getElementById('quotient').innerHTML += " <b>R</b> " + remainderText;
      //announceCorrect();
      announceSuccess();
  
      state = undefined;
    } else {
      announceIncorrect();
    }
  }
  
  // MODEL STUFF
  // ============================================================================================================================

  // functions to set up the game at the start

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
  
  // game steup variables
  var dividend, divisor;
  
  var effectiveDividend;
  var smallDividend;
  
  var expectedDivide;
  var expectedMultiply;
  var expectedSubtract;
  var expectedBringDown;
  var expectedRemainder;
  
  // gets the next dividend to be used (after things after multiplied out and subtracted)
  function getNextSmallDividend() {
    if (takeDigits(effectiveDividend, numDigits(divisor)) < divisor) {
      smallDividend = takeDigits(effectiveDividend, numDigits(divisor) + 1);
      effectiveDividend = dropDigits(effectiveDividend, numDigits(divisor) + 1);
    } else {
      smallDividend = takeDigits(effectiveDividend, numDigits(divisor));
      effectiveDividend = dropDigits(effectiveDividend, numDigits(divisor));
    }
  }
  
  // gets the expected values of various variables that will be used throughout the game
  function getExpectedResults() {
    expectedDivide = Math.floor(smallDividend / divisor);
    expectedMultiply = expectedDivide * divisor;
    expectedSubtract = smallDividend - expectedMultiply;
    expectedBringDown = takeDigits(effectiveDividend, 1);
  }
  
  // the different states of the game
  const States = {
    ExpectingDivision: Symbol("div"),
    ExpectingMultiplication: Symbol("mul"),
    ExpectingSubtraction: Symbol("sub"),
    ExpectingBringDown: Symbol("bdn"),
    ExpectingRemainder: Symbol("rem"),
    Success: Symbol('suc')
  };
  
  var state;    // tracks the state that the game is in
  
  /* Call this function to generate one new division algorithm to run. */
  function startGame() {
    // hardcoded: no way to customize the range of numbers that get used
    divisor = getRandomInt(20) + 1;
    dividend = divisor * (getRandomInt(75) + 10)
                  + (Math.random() < 0.45 ? getRandomInt(20) : 0);
              // random chance of getting a remainder
  
    effectiveDividend = dividend; // the effective dividend used at any point throughout the game (after mult. or sub.)
    
    getNextSmallDividend();
    getExpectedResults();
    state = States.ExpectingDivision;
    stepNum = 0;
    totalDigits = numDigits(dividend);
    questionDivide();
    // offset = numDigits(smallDividend) + 1;
    offset = 0;
    console.log(offset, "J");
    displayInitialNumbers();
  }

  // 1196, 17 FIXED
  // 342, 19 FIXED
  // 870, 15 FIXED
  // 130, 12 fixed???
  // 1443, 19 FIXED