import { useState } from 'react'
import './App.css'

function App() {

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  // Loop through all days of the month
  let day = 1;
  let totalWorkDays = 0;
  while (true) {
    const thisDate = new Date(year, month, day);
    const thisMonth = thisDate.getMonth();

    // Break when we get to the next month
    if (thisMonth !== month) {
      break;
    }

    // If the date is not the weekend, increment the total work days
    const dotw = thisDate.getDay();
    const isWeekend = dotw === 0 || dotw === 6;
    if (!isWeekend) {
      totalWorkDays++;
    }

    // Go to the next day
    day++;
  }

  return <p>Total work days in {month}: {totalWorkDays}</p>;
}

export default App
