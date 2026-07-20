import { useState } from 'react'
import './App.css'

/**
 * @summary An object representing a month, where the keys are the day of the month, and
 * the values indicate whether that day is a workday
 */
type MonthDays = { [key: number]: boolean };

const roundPercentage = (num: number) => Number(num.toFixed(1));

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

function Card(props: {dotm: number, monthName: string, year: number, totalWorkDays: number, workDaysUpToToday: number, completionPctgString: string}): JSX.Element {
  const { dotm, monthName, year, totalWorkDays, workDaysUpToToday, completionPctgString } = props;
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
          <td>{completionPctgString}</td>
        </tr>
      </tbody>
    </table>
  );
}

function Calendar(props: {currentDate: Date, totalWorkDays: number}): JSX.Element {
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
    <table>
      <thead>
        <tr>{headTr}</tr>
      </thead>
      <tbody>
        {bodyTrs}
      </tbody>
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
  const completionPctgRounded = roundPercentage(completionPctg);
  const completionPctgString = `${completionPctgRounded}%`;

  const tableProps = { dotm, monthName, year, totalWorkDays, workDaysUpToToday, completionPctgString };
  const calendarProps = { currentDate, totalWorkDays };
  return (
    <div id='app'>
      <Card {...tableProps} />
      <Calendar {...calendarProps} />
    </div>
  );
}

export default App
