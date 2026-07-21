import { useState } from 'react'
import { roundPercentage } from './utils';

import type { JSX } from 'react';

/** @returns Ordered array of the short names of the days of the week (Sunday first) */
function getDayNames(): string[] {
  const WEEK_LENGTH = 7; // no way

  // map the dotw number to the name of that dotw
  const dayNames: string[] = new Array(WEEK_LENGTH);

  // generate 7 dates (one for each dotw) to get their names
  const rightNow = new Date();
  for (let i = 0; i < WEEK_LENGTH; i++) {
    const date = new Date(rightNow.getFullYear(), rightNow.getMonth(), i);
    const index = date.getDay();
    const name = date.toLocaleString('default', { weekday: 'short' });
    dayNames[index] = name;
  }

  return dayNames;
}

function getDayNameTds(): JSX.Element[] {
  return getDayNames().map((name) => <th>{name}</th>);
}

function getTHeadTr(): JSX.Element {
  return <tr>{getDayNameTds()}</tr>;
}

function getWeeks(currentDate: Date): (number|null)[][] {
  const weeks: (number|null)[][] = [];

  // https://www.geeksforgeeks.org/javascript/how-to-get-the-number-of-days-in-a-specified-month-using-javascript/
  const numberOfDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // add every day of the month to the appropriate week array
  for (let day = 1; day <= numberOfDaysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dotw = date.getDay();

    // start new week
    if (dotw === 0 || weeks.length === 0) {
      weeks.push([]);
    }

    const week = weeks.at(-1);
    if (week) week[dotw] = day;
  }

  // the first and last weeks may have empty space, so fill them with null
  const firstWeek = weeks[0] ?? [];
  const lastWeek = weeks.at(-1) ?? [];
  for (const [index, day] of firstWeek.entries()) {
    if (day !== undefined) {
      break
    }
    firstWeek[index] = null;
  }
  for (const [index, day] of lastWeek.toReversed().entries()) {
    if (day !== undefined) {
      break
    }
    lastWeek[index] = null;
  }

  return weeks;
}

export function Calendar(props: {currentDate: Date, totalWorkDays: number}): JSX.Element {
  const { currentDate, totalWorkDays } = props;

  // whether to show percentages or the day number in the calendar cell
  const [showPercentage, setShowPercentage] = useState(false);

  const currentDay = currentDate.getDate();

  const weeks = getWeeks(currentDate);

  // Create <tr> and <td>s within for each week and day of the month
  let weekendsSeen = 0;
  const bodyTrs = weeks.map((row) => {
    return (
      <tr>
        {row.map((day, index) => {
          let className = 'calendar-day';

          const isWeekend = index === 0 || index === 6;

          // mark weekends
          if (isWeekend) {
            className += ' weekend';
            weekendsSeen++;
          }

          // mark whether day is past/present/future
          if (day && day < currentDay) {
            className += ' past';
          } else if (day === currentDay) {
            className += ' today';
          } else {
            className += ' future';
          }

          // mark day not in this month
          if (day === null) {
            className += ' not-in-month';
          }

          // toggle
          const onClick = () => setShowPercentage(!showPercentage);

          // decide what to show in the calendar cell
          let contents;
          let tooltip;
          if (showPercentage) {
            // show the percentage that will have been completed by the end of the day,
            // unless it's a weekend (would be pointless)
            const workdayNumber = Number(day) - weekendsSeen + 1;
            const pctg = (workdayNumber/totalWorkDays) * 100;
            const pctgRounded = roundPercentage(pctg);
            contents = isWeekend ? '' : `${pctgRounded}%`;
            tooltip = 'The percentage that will have been completed by the end of the day';
          } else {
            // just show the vanilla day number
            contents = day;
          }

          const tdProps = { className, onClick, title: tooltip };
          return <td {...tdProps}>{contents}</td>
        })}
      </tr>
    )
  });

  return (
    <table id='calendar'>
      <thead>
        {getTHeadTr()}
      </thead>
      <tbody>
        {bodyTrs}
      </tbody>
    </table>
  );
}
