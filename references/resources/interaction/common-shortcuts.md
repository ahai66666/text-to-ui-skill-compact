## 5. Common Shortcuts

### Date Picker

- **PROJECT:** The date field is a button with `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`; client surfaces do not expose the browser-native date popup.
- **PROJECT:** Opening the field moves focus to the selected date, otherwise today, otherwise the first visible date.
- **PROJECT:** Left/Right moves one day and Up/Down moves one week. Crossing a month boundary updates the visible month.
- **PROJECT:** Escape closes without changing the selected value and returns focus to the field trigger. Picking a date, Today, or Clear commits the value, closes the popover, and returns focus.
- **PROJECT:** The popover renders a complete 6×7 grid so geometry is stable between months. Adjacent-month dates are muted; selected and today states are visually distinct.

### Time Picker

- **PROJECT:** Use a custom client popover with separate hour and minute listboxes; do not expose the browser-native time popup.
- **PROJECT:** Use 24-hour display by default and a 5-minute step unless the product requires minute-level precision.
- **PROJECT:** Selected Time Picker options use Ghost styling: brand text on a transparent resting background. Hover, Pressed, and Focus use only their matching state feedback; do not use a solid brand Selected fill.
- **PROJECT:** Up/Down moves and selects the adjacent option; Home/End reaches the first or last option in the focused list.
- **PROJECT:** Keep hour/minute changes as a draft until Confirm. Escape or outside click discards the draft; Confirm, Now, and Clear commit and return focus to the field trigger.

Support only shortcuts relevant to the current product:

| Shortcut | Default meaning |
|---|---|
| `Ctrl + A` | Select all in the active scope |
| `Ctrl + C` | Copy |
| `Ctrl + X` | Cut |
| `Ctrl + V` | Paste |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + F` | Search within the active context |
| `Ctrl + S` | Save when the product has editable work |
| `Delete` | Delete the current selection |
| `F2` | Rename in file/item management contexts only |

- **PROJECT:** Do not implement shortcuts whose meaning conflicts with the product context.
- **PROJECT:** Important shortcut actions also require visible UI entry points.
- **DEMO:** Implement the shortcuts included in the requirement contract and test them in the browser.

