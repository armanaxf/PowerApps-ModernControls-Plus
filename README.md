# Fluent UI v2 Navigation Drawer for PowerApps

A PowerApps Component Framework (PCF) control that wraps the Fluent UI v2 **NavDrawer** component. This provides a modern, responsive navigation experience for Canvas Apps with features like:

- **Hamburger Menu**: Toggle between expanded and collapsed states.
- **Selection Pill**: Visual indicator for the currently selected item.
- **Hierarchy Support**: Nested navigation items and categories.
- **Header Branding**: Custom title, Fluent icon, or Image/SVG URL for the app header.
- **Dynamic Sizing**: Automatically fills 100% of the allocated container in PowerApps.

## Properties

### Inputs
- `DefaultSelectedKey`: The key of the initially selected item.
- `HeaderTitle`: Title text for the navigation header.
- `HeaderIcon`: Name of the Fluent UI icon to use in the header.
- `HeaderImageUrl`: URL to a custom image or SVG (overrides HeaderIcon).

### Outputs
- `SelectedKey`: The key of the currently selected navigation item.
- `IsOpen`: Boolean indicating if the drawer is expanded.
- `HeaderSelected`: A boolean that toggles when the header is clicked (use for `OnSelect`).

### Dataset: navItems
The component expects a dataset with the following columns:
- `ItemKey` (Text): Unique identifier for the item.
- `ItemName` (Text): Display name.
- `ItemIcon` (Text): Fluent UI icon name.
- `ItemParentKey` (Text): Key of the parent item for nesting.

## Development

```bash
# Install dependencies
npm install

# Start local test harness
npm start
```

## License
MIT
