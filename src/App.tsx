import { useState } from 'react'
import './App.css'

/**
 * @summary An object representing a month, where the keys are the day of the month, and
 * the values indicate whether that day is a workday
 */
type MonthDays = { [key: number]: boolean };

function getCurrentMonthAsWorkDays(currentDate: Date): MonthDays {
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

function getTotalWorkDaysInMonth(monthDays: MonthDays): number {
  return Object.values(monthDays).filter(Boolean).length;
}

function getMonthName(currentDate: Date): string {
  return currentDate.toLocaleString('default', { month: 'long' });
}

function getTotalWorkDaysUpToDay(monthDays: MonthDays, dotm: number): number {
  const days = Object.entries(monthDays);
  const workDays = days.filter((day) => day[1]);
  const workDaysUpToToday = workDays.filter(([dayNumber]) => Number(dayNumber) <= dotm);
  return workDaysUpToToday.length;
}

function getTable(dotm: number, monthName: string, year: number, totalWorkDays: number, workDaysUpToToday: number, completionPctg: string): JSX.Element {
  return (
    <table>
      <tbody>
        <tr>
          <td>Today's date</td>
          <td>{dotm} {monthName} {year}</td>
        </tr>
        <tr>
          <td>Total work days in {monthName}</td>
          <td>{totalWorkDays}</td>
        </tr>
        <tr>
          <td>Work days of the month so far</td>
          <td>{workDaysUpToToday}</td>
        </tr>
        <tr>
          <td>Percentage of the work month completed</td>
          <td>{completionPctg}</td>
        </tr>
      </tbody>
    </table>
  );
}

function getCalendar(currentDate: Date): JSX.Element {
  const dayNames = {};
  const rows = [[]];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  let day = 1;
  while (true) {
    const thisDate = new Date(year, month, day);
    const thisMonth = thisDate.getMonth();
    if (thisMonth !== month) {
      break;
    }

    const dotw = thisDate.getDay();

    dayNames[dotw] = thisDate.toLocaleString('default', { weekday: 'long' });

    if (dotw === 0) {
      // start new row
      rows.push([]);
    }

    const row = rows.at(-1);
    row[dotw] = day;

    day++;
  }

  console.log(rows);
  console.log(dayNames);

  const headTr = Object.values(dayNames).map((name) => <th>{name}</th>);

  return (
    <table>
      <thead>
        <tr>{headTr}</tr>
      </thead>
      <tbody></tbody>
    </table>
  );
}

function App() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthName = getMonthName(currentDate);
  const dotm = currentDate.getDate();

  const monthDays = getCurrentMonthAsWorkDays(currentDate);
  const totalWorkDays = getTotalWorkDaysInMonth(monthDays);

  const workDaysUpToToday = getTotalWorkDaysUpToDay(monthDays, dotm);

  const completionPctg = (workDaysUpToToday / totalWorkDays) * 100;
  const completionPctgRounded = completionPctg.toFixed(2);
  const completionPctgString = `${completionPctgRounded}%`;

  const table = getTable(dotm, monthName, year, totalWorkDays, workDaysUpToToday, completionPctgString);
  const calendar = getCalendar(currentDate);
  return (
    <div>
      <div>{table}</div>
      <br/>
      <div>{calendar}</div>
    </div>
  );
}

export default App
