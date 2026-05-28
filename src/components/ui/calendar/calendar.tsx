// Origin: No Radix primitive — wraps react-day-picker for interaction and a11y
import "./calendar.css"
import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalendarProps = Omit<
  React.ComponentProps<typeof DayPicker>,
  "classNames"
> & {
  className?: string
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, ...props }, ref) => (
    // DayPicker v10 does not accept a ref — the div is a transparent ref target only.
    // The visual root is .calendar-root on the DayPicker element inside.
    <div ref={ref}>
      <DayPicker
        mode="single"
        navLayout="around"
        showOutsideDays
        classNames={{
          root: cn("calendar-root", className),
          months: "calendar-months",
          month: "calendar-month",
          month_caption: "calendar-month-caption",
          nav: "calendar-nav",
          button_previous: "calendar-nav-button calendar-nav-button--prev",
          button_next: "calendar-nav-button calendar-nav-button--next",
          caption_label: "calendar-caption-label ts-title",
          month_grid: "calendar-month-grid",
          weekdays: "calendar-weekdays",
          weekday: "calendar-weekday ts-caption",
          weeks: "calendar-weeks",
          week: "calendar-week",
          day: "calendar-day",
          day_button: "calendar-day-button ts-detail",
          selected: "calendar-day--selected",
          today: "calendar-day--today",
          outside: "calendar-day--outside",
          disabled: "calendar-day--disabled",
          hidden: "calendar-day--hidden",
          focused: "calendar-day--focused",
          chevron: "calendar-chevron",
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "right" ? (
              <ChevronRight className="size-4" aria-hidden />
            ) : (
              <ChevronLeft className="size-4" aria-hidden />
            ),
        }}
        {...props}
      />
    </div>
  )
)
Calendar.displayName = "Calendar"

export { Calendar }
