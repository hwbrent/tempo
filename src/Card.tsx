export function Card(props: {dotm: number, monthName: string, year: number, totalWorkDays: number, workDaysUpToToday: number, completionPctgString: string}): JSX.Element {
  const { dotm, monthName, year, totalWorkDays, workDaysUpToToday, completionPctgString } = props;
  const rows = [
    ["Today's date", `${dotm} ${monthName} ${year}`],
    [`Total work days in ${monthName}`, totalWorkDays],
    ['Work days of the month so far', workDaysUpToToday],
    ['Percentage of the work month completed', completionPctgString],
  ]
  const trs = rows.map(([left, right]) => <tr><td>{left}</td><td>{right}</td></tr>);
  return (
    <table id='card'>
      <tbody>
        {trs}
      </tbody>
    </table>
  );
}
