
type Col<T> = { key: keyof T; header: string };
export default function DataTable<T extends { id: string }>({ rows, columns }: { rows: T[]; columns: Col<T>[] }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            {columns.map(c => <th key={String(c.key)} className="p-3 text-xs uppercase text-gray-500">{c.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t">
              {columns.map(c => <td key={String(c.key)} className="p-3">{String(r[c.key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
