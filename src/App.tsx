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

function getTotalWorkDaysInMonth(monthDays: { [key: number]: boolean }): number {
  return Object.values(monthDays).filter(Boolean).length;
}

function getMonthName(currentDate: Date): string {
  return currentDate.toLocaleString('default', { month: 'long' });
}

function getWorkDaysUpToDay(monthDays: { [key: number]: boolean }, dotm: number): number {
  const days = Object.entries(monthDays);
  const workDays = days.filter(([day, isWorkDay]) => isWorkDay);
  const workDaysUpToToday = workDays.filter(([day]) => Number(day) <= dotm);
  return workDaysUpToToday.length;
}

function App() {
  const currentDate = new Date();
  const monthName = getMonthName(currentDate);
  const dotm = currentDate.getDate();

  const monthDays = getCurrentMonthAsWorkDays(currentDate);
  const totalWorkDays = getTotalWorkDaysInMonth(monthDays);

  const workDaysUpToToday = getWorkDaysUpToDay(monthDays, dotm);

  const completionPctg = (workDaysUpToToday / totalWorkDays) * 100;
  const completionPctgRounded = completionPctg.toFixed(2);

  return (
    <div>
      <p>Total work days in {monthName}: {totalWorkDays}</p>
      <p>Current day of the month: {dotm}</p>
      <p>Work days of the month so far: {workDaysUpToToday}</p>
      <p>Percentage of the work month completed: {completionPctgRounded}%</p>
    </div>
  );
}

export default App
