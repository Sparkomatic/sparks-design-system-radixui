# Date Picker — Requirements Questions

Please fill in each `[Answer]:` field and let me know when done.

---

## Q1: What selection mode should the Date Picker support?

This is the highest-impact decision — single vs range changes the component structure significantly.

1. Single date only (most common for forms — birth date, due date, appointment)
2. Single date + date range (both modes, controlled by a prop)
3. Other (please specify)

[Answer]:

---

## Q2: Should the Date Picker also support time selection?

1. Date only (no time — keeps the component focused and simpler)
2. Date + time (adds a time input section below the calendar)
3. Other (please specify)

[Answer]:

---

## Q3: Should we support disabled date constraints?

For example, blocking out past dates (a "must be future" booking field) or a min/max date range.

1. Yes — support `minDate`, `maxDate`, and `disabledDates` props
2. No — keep it simple for now, can add later
3. Other (please specify)

[Answer]:

---

## Q4: How should the trigger look?

The element the user clicks to open the calendar.

1. Full-width text input with calendar icon (matches Text Input styling — most common in forms)
2. Icon button only (compact — good for inline date controls)
3. Other (please specify)

[Answer]:
