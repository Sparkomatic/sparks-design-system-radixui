import type { Preview } from "@storybook/react-vite"
import "../src/index.css"

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark",  title: "Dark",  icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    controls: { expanded: true },
    a11y: {
      manual: false,
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme ?? "light") as "light" | "dark"
      if (theme === "dark") {
        document.documentElement.dataset.theme = "dark"
      } else {
        delete document.documentElement.dataset.theme
      }
      return Story()
    },
  ],
}

export default preview
