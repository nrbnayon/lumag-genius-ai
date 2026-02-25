import { topBudgetMenus } from "@/data/analyticsData";
import type { TopBudgetMenu } from "@/types/analytics";

export function TopBudgetMenusPanel() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-foreground">Top Budget Menus</h3>
        <p className="text-sm text-secondary">Based on this month</p>
      </div>
      <div className="space-y-0 divide-y divide-gray-50">
        {topBudgetMenus.map((menu: TopBudgetMenu) => (
          <div
            key={menu.id}
            className="flex items-center justify-between py-3.5 hover:bg-gray-50/60 transition-colors rounded-lg px-1"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#E6F4FF] text-[#0190FE] font-bold flex items-center justify-center shrink-0">
                {menu.id}
              </span>
              <span className="text-sm font-medium text-foreground">
                {menu.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {menu.amount}
              </p>
              <p className="text-xs font-medium text-secondary">
                {menu.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
