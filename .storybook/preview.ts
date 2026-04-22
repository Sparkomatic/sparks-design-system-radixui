import type { Preview } from "@storybook/react-vite"
import "../src/index.css"

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "oklch(1 0 0)" },
        { name: "dark",  value: "oklch(0.145 0 0)" },
      ],
    },
    a11y: {
      // Run accessibility checks automatically on every story
      manual: false,
    },
  },
  // Apply .dark class to <html> when dark background is selected
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === "oklch(0.145 0 0)"
      document.documentElement.classList.toggle("dark", isDark)
      return Story()
    },
  ],
}

export default preview
