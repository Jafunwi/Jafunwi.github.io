// status.js - live Open/Closed status for the Hours page
// Compares the visitor's current local time to the cart's weekly schedule.

// Weekly schedule, indexed by Date.getDay() (0 = Sunday ... 6 = Saturday).
// Times are 24-hour clock hours, so 17 means 5:00 PM.
const schedule = [
  { open: 9, close: 19 },  // Sunday
  { open: 11, close: 17 }, // Monday
  { open: 11, close: 17 }, // Tuesday
  { open: 11, close: 17 }, // Wednesday
  { open: 11, close: 17 }, // Thursday
  { open: 11, close: 19 }, // Friday
  { open: 9, close: 19 }   // Saturday
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const statusText = document.getElementById('cart-status');

// Converts a 24-hour clock hour (such as 17) into text such as "5:00 PM".
function formatHour(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return twelveHour + ':00 ' + suffix;
}

// Finds the next time the cart opens, looking up to a week ahead.
// Returns a phrase such as "today at 11:00 AM" or "Friday at 11:00 AM".
function findNextOpening(now) {
  const currentHour = now.getHours() + now.getMinutes() / 60;

  for (let offset = 0; offset < 7; offset++) {
    const dayIndex = (now.getDay() + offset) % 7;
    const hours = schedule[dayIndex];

    // Today only counts if opening time has not passed yet.
    if (offset === 0 && currentHour >= hours.open) {
      continue;
    }

    let dayLabel = dayNames[dayIndex];
    if (offset === 0) {
      dayLabel = 'today';
    } else if (offset === 1) {
      dayLabel = 'tomorrow';
    }
    return dayLabel + ' at ' + formatHour(hours.open);
  }
  return 'soon';
}

// Writes the current status into the page.
function updateStatus() {
  const now = new Date();
  const hours = schedule[now.getDay()];
  const currentHour = now.getHours() + now.getMinutes() / 60;

  if (currentHour >= hours.open && currentHour < hours.close) {
    statusText.textContent = 'The cart is open right now, until ' + formatHour(hours.close) + '.';
  } else {
    statusText.textContent = 'The cart is closed right now. We open again ' + findNextOpening(now) + '.';
  }
}

// Show the status immediately, then refresh it once a minute.
updateStatus();
setInterval(updateStatus, 60000);