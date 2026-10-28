// Calculator script
// Grab the display element and all calculator buttons
let display = document.getElementById('display');
let buttonElements = document.querySelectorAll('.calc-button');

// Holds the expression the user is building
let currentExpression = '';

/**
 * Safely evaluates a mathematical expression string.
 * Uses the Function constructor to evaluate the expression inside a try/catch block.
 * Handles division by zero (Infinity, -Infinity) and NaN results as errors.
 * Returns the result as a string, or "Error" on failure.
 *
 * @param {string} expr - The mathematical expression to evaluate.
 * @returns {string} - The evaluated result or "Error".
 */
function evaluateExpression(expr) {
  try {
    // Guard against empty expressions
    if (expr.trim() === '') {
      return '';
    }
    // eslint-disable-next-line no-new-func
    const result = Function('return ' + expr)();
    // Detect division by zero or other invalid numeric results
    if (typeof result === 'number' && (!isFinite(result) || isNaN(result))) {
      return 'Error';
    }
    return String(result);
  } catch (e) {
    // Syntax errors or other evaluation problems
    return 'Error';
  }
}

/**
 * Refreshes the calculator display.
 * Shows the current expression or a default "0" when empty.
 */
function updateDisplay() {
  // Guard against missing display element (e.g., during server‑side rendering)
  if (!display) return;
  // If currentExpression is a non‑empty string, show it; otherwise show "0"
  display.textContent = currentExpression !== '' ? currentExpression : '0';
}

/**
 * Handles a button click event.
 * Reads the data-value attribute from the clicked button and updates the
 * current expression accordingly. Supports numbers, operators, decimal point,
 * clear ("C"), backspace ("←"), and evaluation ("=").
 * After processing, the display is updated.
 *
 * @param {Event} event - The click event from a calculator button.
 */
function handleButtonClick(event) {
  const value = event.target.dataset.value;
  if (value === undefined) return; // ignore clicks that aren't on a button

  switch (value) {
    case 'clear': // "C" – clear the whole expression
      currentExpression = '';
      break;
    case 'backspace': // "←" – remove the last character
      currentExpression = currentExpression.slice(0, -1);
      break;
    case '=': // evaluate the expression
      currentExpression = evaluateExpression(currentExpression);
      break;
    default:
      // Append numbers, operators (+, -, *, /) and decimal point
      currentExpression += value;
  }

  updateDisplay();
}

/**
 * Handles keyboard key presses and maps them to calculator button actions.
 * Supported keys: digits 0‑9, '.', '+', '-', '*', '/', Enter, Backspace, Escape.
 * The function creates a synthetic event with the appropriate data-value and
 * forwards it to {@link handleButtonClick}.
 *
 * @param {KeyboardEvent} e - The keydown event.
 */
function handleKeyPress(e) {
  let value;
  switch (e.key) {
    case '0': case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8': case '9':
      value = e.key;
      break;
    case '.':
      value = '.';
      break;
    case '+': case '-': case '*': case '/':
      value = e.key;
      break;
    case 'Enter':
      value = '=';
      break;
    case 'Backspace':
      value = 'backspace';
      break;
    case 'Escape':
      value = 'clear';
      break;
    default:
      return; // ignore unsupported keys
  }

  // Prevent default actions like form submission or navigation
  e.preventDefault();

  // Create a minimal synthetic event compatible with handleButtonClick
  const syntheticEvent = {
    target: {
      dataset: { value }
    }
  };

  handleButtonClick(syntheticEvent);
}

/**
 * Initialise calculator UI and event listeners.
 * Attaches click listeners to each calculator button, registers the keyboard
 * handler, and updates the display to its initial state.
 */
function initCalculator() {
  // Re‑query DOM elements in case the script ran before the document was ready.
  display = document.getElementById('display');
  buttonElements = document.querySelectorAll('.calc-button');

  // Attach click handlers to every calculator button
  buttonElements.forEach((btn) => {
    btn.addEventListener('click', handleButtonClick);
  });

  // Register keyboard handler
  document.addEventListener('keydown', handleKeyPress);

  // Initialise the display
  updateDisplay();
}

// Run initCalculator after the DOM has fully loaded.
document.addEventListener('DOMContentLoaded', initCalculator);
