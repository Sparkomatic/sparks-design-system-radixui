import * as React from "react"
import { Moon, Sun } from "lucide-react"

import "./playground.css"
import { ButtonPreview } from "./previews/button"
import { CalendarPreview } from "./previews/calendar"
import { CardPreview } from "./previews/card"
import { ComboboxPreview } from "./previews/combobox"
import { DropdownMenuPreview } from "./previews/dropdown-menu"
import { TextInputPreview } from "./previews/text-input"

const previews: { name: string; component: React.ComponentType }[] = [
  { name: "Button", component: ButtonPreview },
  { name: "Calendar", component: CalendarPreview },
  { name: "Card", component: CardPreview },
  { name: "Combobox", component: ComboboxPreview },
  { name: "Dropdown Menu", component: DropdownMenuPreview },
  { name: "Text Input", component: TextInputPreview },
]

export function Playground() {
  const [active, setActive] = React.useState<string | null>(
    previews[0]?.name ?? null
  )
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.dataset.theme = "dark"
    } else {
      delete document.documentElement.dataset.theme
    }
  }, [theme])

  const ActivePreview = previews.find((p) => p.name === active)?.component

  return (
    <div className="flex min-h-screen pg-root">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r p-4 pg-sidebar">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest pg-section-label">
            Components
          </p>
          <button
            onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-1 transition-colors pg-theme-toggle"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {previews.length === 0 ? (
          <p className="text-xs pg-section-label">No components yet.</p>
        ) : (
          <nav className="space-y-1">
            {previews.map((p) => (
              <button
                key={p.name}
                onClick={() => setActive(p.name)}
                className={[
                  "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                  active === p.name ? "pg-nav-btn--active" : "pg-nav-btn",
                ].join(" ")}
              >
                {p.name}
              </button>
            ))}
          </nav>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-10">
        {ActivePreview ? (
          <ActivePreview />
        ) : (
          <div className="flex h-full items-center justify-center text-sm pg-section-label">
            Build a component, add its preview file, then import it above.
          </div>
        )}
      </main>
    </div>
  )
}
