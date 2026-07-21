import { useState } from 'react'
import { roundPercentage } from './utils';

import type { JSX } from 'react';

export function Calendar(props: {currentDate: Date, totalWorkDays: number}): JSX.Element {
  const { currentDate, totalWorkDays } = props;

  // whether to show percentages or the day number in the calendar cell
  const [showPercentage, setShowPercentage] = useState(false);

  // map the dotw number to the name of that dotw
  const dayNames: {[dayName: number]: string} = {};

  const rows = [[]];

  const currentDay = currentDate.getDate();
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

    dayNames[dotw] = thisDate.toLocaleString('default', { weekday: 'short' });

    if (dotw === 0) {
      // start new row
      rows.push([]);
    }

    const row = rows.at(-1);
    row[dotw] = day;

    day++;
  }

  const headTr = Object.values(dayNames).map((name) => <th>{name}</th>);

  // ensure all body rows have 7 values
  for (const row of rows) {
    for (let i = 0; i < 7; i++) {
      if (row[i] === undefined) {
        row[i] = null;
      }
    }
  }

  // Create <tr> and <td>s within for each week and day of the month
  let weekendsSeen = 0;
  const bodyTrs = rows.map((row) => {
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
          if (day < currentDay) {
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
            const workdayNumber = day - weekendsSeen + 1;
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
        <tr>{headTr}</tr>
      </thead>
      <tbody>
        {bodyTrs}
      </tbody>
    </table>
  );
}
