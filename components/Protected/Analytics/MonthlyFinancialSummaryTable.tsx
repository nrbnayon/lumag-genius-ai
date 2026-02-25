import { monthlyFinancialSummary } from "@/data/analyticsData";
import type { MonthlyFinancialSummary } from "@/types/analytics";

const HEADER_COLS = [
  "Month",
  "Revenue",
  "Food Cost",
  "Profit",
  "Profit Margin",
];

export function MonthlyFinancialSummaryTable() {
  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-bold text-foreground">
          Monthly Financial Summary
        </h3>
        <p className="text-sm text-secondary">View the summary</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EBF5FF]">
              {HEADER_COLS.map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-sm font-semibold text-[#3B82F6] whitespace-nowrap first:rounded-none last:rounded-none"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {monthlyFinancialSummary.map((row: MonthlyFinancialSummary, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">
                  {row.month}
                </td>
                <td className="px-6 py-4 text-secondary">{row.revenue}</td>
                <td className="px-6 py-4 text-secondary">{row.foodCost}</td>
                <td className="px-6 py-4 text-secondary">{row.profit}</td>
                <td className="px-6 py-4 text-secondary">{row.profitMargin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
