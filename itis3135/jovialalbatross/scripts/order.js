// order.js - order calculator for the Menu page
// Adds up the price of every tea the visitor selects and shows the total.

const orderForm = document.getElementById('order-form');
const orderTotal = document.getElementById('order-total');
const clearButton = document.getElementById('clear-order');

// Reads every quantity box, multiplies by its data-price, and updates the total text.
function updateTotal() {
  let total = 0;
  let cups = 0;

  orderForm.querySelectorAll('input[type="number"]').forEach(function (input) {
    // Treat blank, negative, or invalid entries as zero
    const quantity = Math.max(0, parseInt(input.value, 10) || 0);
    total += quantity * parseFloat(input.dataset.price);
    cups += quantity;
  });

  const cupWord = cups === 1 ? 'cup' : 'cups';
  orderTotal.textContent = 'Your order: ' + cups + ' ' + cupWord + ', total $' + total.toFixed(2);
}

// Resets every quantity to zero and refreshes the total.
function clearOrder() {
  orderForm.querySelectorAll('input[type="number"]').forEach(function (input) {
    input.value = 0;
  });
  updateTotal();
}

// Update whenever a quantity changes, and when the clear button is clicked.
orderForm.addEventListener('input', updateTotal);
clearButton.addEventListener('click', clearOrder);

// Show the starting total on page load.
updateTotal();