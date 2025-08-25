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

- **Breadcrumb Navigation**: Given the ambiguity around the depth of the file data, I made the assumption that it could possibly be deeply nested. I've added a breadcrumb trail in the header to show the current path and allow quick navigation back to parent folders. The breadcrumb could also be made editable to allow users to type and jump directly to a desired folder, although this would probably require it to be removed from the header into an input field.

### File Types & Icons

- **Dynamic File Type Support**: The current implementation has a limited set of file types. We would need to liaise with the backend team to get a comprehensive list of all supported file types and their associated metadata.
- **Custom Icons**: Implement custom icons for different file types to improve visual recognition and user experience.

### File Actions

- **Action Dropdown/Pane**: In a real world setting files would probably have a dropdown action button or a details pane to show file metadata and provide actions like download, delete, etc.

### Performance & Data Management

- **Pagination**: For large file lists we would need pagination.
- **Data Updates & Caching**: We're not sure how the data will be updated (real-time, polling, manual refresh) which affects our caching strategy. While memoization can speed things up, it can also cause weird bugs if the data references aren't stable. We'd need to figure out if it's actually worth it based on how the data actually changes.
- **Library Usage**: In a real app, we'd likely use a table library like TanStack Table or React Table which would handle sorting, filtering, and pagination automatically. For the sake of this demo I chose not to as table libraries can be quite heavy and complex for a simple file browser.
- **State Persistence**: If the document browser ended up being more feature-rich and an important part of people's workflows, we'd want to store search state (current folder, filter, sort) in the URL or localStorage to prevent losing user context on accidental refresh.

### Responsiveness & Mobile Support

- **Touch Target Optimization**: Sort buttons could be enlarged from current 24x24px to 44x44px minimum for better mobile usability.

- **Text Sizing**: Add responsive text sizing and padding/spacing to better utilize screen real estate across different device sizes.
