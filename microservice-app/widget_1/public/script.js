// Define an array of inspirational quotes
const quotes = [
    "Believe you can and you're halfway there. -Theodore Roosevelt",
    "Strive not to be a success, but rather to be of value. -Albert Einstein",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. -Winston S. Churchill",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. -Christian D. Larson",
    "Don't watch the clock; do what it does. Keep going. -Sam Levenson"
];

// Generate a random index to select a quote from the array
const index = Math.floor(Math.random() * quotes.length);

// Display the randomly selected quote
document.getElementById("quote").innerHTML = quotes[index];