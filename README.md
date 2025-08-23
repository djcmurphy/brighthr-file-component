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

## Features

- View files and folders with file type, name, and date added
- Click on folders to view contents
- Sort by name or date
- Filter by filename

Avoided useEffect by handling all state changes through user interactions. Functions receive the current state as parameters rather than relying on previous state values in setState callbacks. With frequent data updates from sorting/filtering, useEffect would cause unnecessary re-renders.

In a real app, you would most likely already have a table library that does a lot of these features, but for the sake of the demo I just implemented it manually.

## Future Enhancements

Given more time, I would implement:

### Navigation

- **Breadcrumb Navigation**: Currently the app allows nested folder navigation but lacks a breadcrumb trail to show the current path. This would help users understand where they are in the file structure and allow quick navigation back to parent folders.

### File Types & Icons

- **Dynamic File Type Support**: The current implementation has a limited set of file types. We would need to liaise with the backend team to get a comprehensive list of all supported file types and their associated metadata.
- **Custom Icons**: Implement custom icons for different file types to improve visual recognition and user experience.

### File Actions

- **Action Dropdown/Pane**: Files would need a dropdown action button or a details pane to show file metadata and provide actions like download, delete, rename, or share.

### Performance & Data Management

- **Pagination**: For large file lists, we'd need pagination to keep things snappy.
- **Data Updates**: We're not sure how the data will be updated (real-time, polling, manual refresh) which affects how we handle caching and memoization.
- **Memoization**: While it can speed things up, memoization can also cause weird bugs if the data references aren't stable. We'd need to figure out if it's actually worth it based on how the data actually changes.
