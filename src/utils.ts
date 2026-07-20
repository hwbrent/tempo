import type { MonthDays } from './types';

export function roundPercentage(num: number) {
    return Number(num.toFixed(1));
}

export function getCurrentMonthAsWorkDays(currentDate: Date): MonthDays {
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

export function getTotalWorkDaysInMonth(monthDays: MonthDays): number {
  return Object.values(monthDays).filter(Boolean).length;
}

export function getMonthName(currentDate: Date): string {
  return currentDate.toLocaleString('default', { month: 'long' });
}

export function getTotalWorkDaysUpToDay(monthDays: MonthDays, dotm: number): number {
  const days = Object.entries(monthDays);
  const workDays = days.filter((day) => day[1]);
  const workDaysUpToToday = workDays.filter(([dayNumber]) => Number(dayNumber) < dotm);
  return workDaysUpToToday.length;
}
