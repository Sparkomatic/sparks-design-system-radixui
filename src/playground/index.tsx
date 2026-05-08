import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { ButtonPreview } from "./previews/button"
import { CardPreview } from "./previews/card"
import { ComboboxPreview } from "./previews/combobox"

const previews: { name: string; component: React.ComponentType }[] = [
  { name: "Button", component: ButtonPreview },
  { name: "Card", component: CardPreview },
  { name: "Combobox", component: ComboboxPreview },
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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-border bg-muted p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Components
          </p>
          <button
            onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {previews.length === 0 ? (
          <p className="text-xs text-muted-foreground">No components yet.</p>
        ) : (
          <nav className="space-y-1">
            {previews.map((p) => (
              <button
                key={p.name}
                onClick={() => setActive(p.name)}
                className={[
                  "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                  active === p.name
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-background",
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
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Build a component, add its preview file, then import it above.
          </div>
        )}
      </main>
    </div>
  )
}
