import './App.css'

import { Card } from './Card';
import { Calendar } from './Calendar';
import {
  roundPercentage,
  getCurrentMonthAsWorkDays,
  getTotalWorkDaysInMonth,
  getMonthName,
  getTotalWorkDaysUpToDay
} from './utils';

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
