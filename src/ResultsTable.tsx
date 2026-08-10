type ResultsTableProps = {
  caption: string;
  headings: string[];
  rows: { cells: string[]; key: string }[];
};

export function ResultsTable({ caption, headings, rows }: ResultsTableProps) {
  return (
    <div className="results-wrap">
      <table className="results-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row">{row.cells[0]}</th>
              {row.cells.slice(1).map((cell, index) => (
                <td key={`${row.key}-${index}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
