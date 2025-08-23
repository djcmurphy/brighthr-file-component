# BrightHR File Browser Component

A React TypeScript application that displays a file and folder browser interface.

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Testing

Run the tests with:

```bash
npm test
```

## Future Enhancements/Changes

### Navigation

- **Breadcrumb Navigation**: Given the ambiguity around the depth of the file data, I made the assumption that it could possibly be deeply nested. Currently the app allows nested folder navigation but lacks a breadcrumb trail to show the current path. A breadcrumb would help users understand where they are in the file structure and allow quick navigation back to parent folders. This could even be editable and allow users to jump directly to the desired folder.

### File Types & Icons

- **Dynamic File Type Support**: The current implementation has a limited set of file types. We would need to liaise with the backend team to get a comprehensive list of all supported file types and their associated metadata.
- **Custom Icons**: Implement custom icons for different file types to improve visual recognition and user experience.

### File Actions

- **Action Dropdown/Pane**: Files would need a dropdown action button or a details pane to show file metadata and provide actions like download, delete, rename, or share.

### Performance & Data Management

- **Pagination**: For large file lists we would need pagination.
- **Data Updates & Caching**: We're not sure how the data will be updated (real-time, polling, manual refresh) which affects our caching strategy. While memoization can speed things up, it can also cause weird bugs if the data references aren't stable. We'd need to figure out if it's actually worth it based on how the data actually changes.
- **Library Usage**: In a real app, we'd likely use a table library like TanStack Table or React Table which would handle sorting, filtering, and pagination automatically. For the sake of this demo I chose not to as table libraries can be quite heavy and complex for a simple file browser.
- **State Persistence**: If the document browser ended up being more feature-rich and an important part of people's workflows, we'd want to store search state (current folder, filter, sort) in the URL or localStorage to prevent losing user context on accidental refresh.

### Responsiveness & Mobile Support

- **Mobile Breakpoints**: The table has a fixed 600px minimum width that causes horizontal scrolling on phones. We'd need to implement responsive breakpoints and adjust the layout based on screen size.

- **Touch Optimization**: Current touch targets like the sort buttons are too small (24x24px) for mobile use. We'd need to increase these to at least 40x40px and replace hover states with touch-friendly interactions.

- **Responsive Table Layout**: On mobile, we could keep the table but collapse all the information into a single cell per row. Each row would stack the file name, type, and date vertically within one `<td>`, maintaining the table structure while fitting narrow screens.

- **Container Width Issues**: The fixed `min-w-[600px]` forces horizontal scrolling. We'd need to use percentage-based or viewport-relative widths with `overflow-x-auto` as a fallback for edge cases.
