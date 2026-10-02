import type { JSX } from 'react';

/** @enum {string} */
const Explanation = {
  WORK_DAY: 'A work day is considered to be any non-weekend day',
  WORK_MONTH: 'A work month is the total number of work days in the month'
}

function Explain(innerText: string, explanation: string): JSX.Element {
  return <span className='explain' title={explanation}>{innerText}</span>
}

export function Card(props: {dotm: number, monthName: string, year: number, totalWorkDays: number, workDaysUpToToday: number, completionPctgString: string}): JSX.Element {
  const { dotm, monthName, year, totalWorkDays, workDaysUpToToday, completionPctgString } = props;
  return (
    <table id='card'>
      <tbody>
        <tr>
          <td>Today's date</td>
          <td>{dotm} {monthName} {year}</td></tr>
        <tr>
          <td>Total {Explain('work days', Explanation.WORK_DAY)} in {monthName}</td>
          <td>{totalWorkDays}</td></tr>
        <tr>
          <td>{Explain('Work days', Explanation.WORK_DAY)} of the month so far</td>
          <td>{workDaysUpToToday}</td>
          </tr>
        <tr>
          <td>Percentage of the {Explain('work month', Explanation.WORK_MONTH)} completed</td>
          <td>{completionPctgString}</td>
        </tr>
      </tbody>
    </table>
  );
}
