import { ChevronDown, Filter } from "lucide-react";
import type { Alert } from "../../domain/entities/Alert";
import type { Transaction } from "../../domain/entities/Transaction";

export interface GridRow {
  id: string;
  cells: string[];
  detail?: Alert | Transaction;
}

interface DataGridProps {
  headers: string[];
  rows: GridRow[];
  query: string;
  onSelect: (item: Alert | Transaction) => void;
  showLastColumn: boolean;
  compact: boolean;
}

export function DataGrid({ headers, rows, query, onSelect, showLastColumn, compact }: DataGridProps) {
  const visibleColumnCount = showLastColumn ? headers.length : headers.length - 1;
  const visibleRows = rows.filter((row) => `${row.id} ${row.cells.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="border-b border-slate-300 bg-white">
      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse text-left whitespace-nowrap">
          <thead className="bg-slate-200">
            <tr>
              <th className="w-10 min-w-10 border border-slate-300 p-0" aria-label="Row number" />
              {headers.slice(0, visibleColumnCount).map((header) => (
                <th key={header} className="h-11 border border-slate-300 px-3 text-xs font-medium text-slate-700">
                  <span>{header}</span><Filter className="float-right ml-4" size={13} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => (
              <tr
                key={row.id}
                className={`cursor-pointer hover:bg-blue-50 ${index % 2 ? "bg-zinc-100" : "bg-white"}`}
                onClick={() => row.detail && onSelect(row.detail)}
                tabIndex={row.detail ? 0 : undefined}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && row.detail) onSelect(row.detail);
                }}
              >
                <td className={`w-10 border border-slate-300 px-2 text-right text-[11px] text-slate-500 ${compact ? "h-8" : "h-11"} bg-zinc-100`}>{index + 1}</td>
                {row.cells.slice(0, visibleColumnCount).map((cell, cellIndex) => (
                  <td key={`${row.id}-${cellIndex}`} className={`border border-slate-300 px-3 text-xs text-slate-700 ${compact ? "h-8" : "h-11"}`}>
                    {cellIndex === 0 ? <span className="text-blue-700">{cell}</span> : cell}
                  </td>
                ))}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr><td className="h-20 border border-slate-300 text-center text-sm text-slate-500" colSpan={visibleColumnCount + 1}>No records match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex min-h-10 items-center justify-between border-t border-slate-100 px-4 text-xs text-slate-500">
        <span>Showing <strong className="font-semibold text-slate-700">{visibleRows.length}</strong> of <strong className="font-semibold text-slate-700">{rows.length}</strong> records</span>
        <button className="flex items-center gap-1 border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500 disabled:cursor-default" disabled><ChevronDown size={14} /> Page 1 of 1</button>
      </div>
    </div>
  );
}
