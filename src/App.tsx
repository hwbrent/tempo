import { useState } from 'react'
import './App.css'

function getCurrentMonthAsWorkDays(currentDate: Date): { [key: number]: boolean } {
  const monthDays = {};

  // Figure out the current year and month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Loop through all days of the current month
  let day = 1;
  while (true) {
    const thisDate = new Date(year, month, day);
    const thisMonth = thisDate.getMonth();

    // Break when we get to the next month
    if (thisMonth !== month) {
      break;
    }

    // record whether the current day is a workday (i.e. not a weekend)
    const dotw = thisDate.getDay();
    const isWeekend = dotw === 0 || dotw === 6;
    monthDays[day] = !isWeekend;

    // Go to the next day
    day++;
  }

  return monthDays;
}

function getWorkDaysInCurrentMonth(currentDate: Date): number {
  // Figure out the current year and month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Loop through all days of the current month
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

  return totalWorkDays;
}

function getMonthName(currentDate: Date): string {
  return currentDate.toLocaleString('default', { month: 'long' });
}

function App() {
  const currentDate = new Date();
  const monthName = getMonthName(currentDate);
  const totalWorkDays = getWorkDaysInCurrentMonth(currentDate);
  const dotm = currentDate.getDate();
  return (
    <div>
      <p>Total work days in {monthName}: {totalWorkDays}</p>
      <p>Current day of the month: {dotm}</p>
    </div>
  );
}

export default App
