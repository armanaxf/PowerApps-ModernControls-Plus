# PowerApps Modern Controls Plus

A suite of **Fluent UI v9** PCF components for Power Apps Canvas Apps, designed to fill gaps in the native modern controls.

## Components

| Component | Description | Status |
|-----------|-------------|--------|
| **FluentNav** | Navigation drawer with hierarchical menu support | ✅ Available |
| **FluentMessageBar** | Inline message bar for alerts, warnings, and notifications | ✅ Available |
| **FluentBreadcrumb** | Hierarchical navigation breadcrumb | ✅ Available |
| FluentCard | Content card container | 🔜 Coming Soon |
| FluentDialog | Modal dialog for confirmations and forms | 🔜 Coming Soon |
| FluentToast | Toast notifications | 🔜 Coming Soon |
| FluentDateRangePicker | Date range selection | 🔜 Coming Soon |

## Installation

1. Download the latest solution `.zip` from [Releases](../../releases)
2. Import the solution into your Power Apps environment
3. The components will be available in your Canvas App under **Code Components**

## Usage

### FluentNav

A navigation drawer component with support for:
- Hierarchical menu items (parent/child)
- Collapsible sidebar
- Custom header with icon or image
- Selection events

**Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `navItems` | Dataset | Collection of navigation items |
| `DefaultSelectedKey` | Text | Initially selected item key |
| `HeaderTitle` | Text | Title in the header |
| `HeaderIcon` | Text | Fluent icon name for header |
| `HeaderImageUrl` | URL | Custom image URL for header |
| `SelectedKey` | Text (Output) | Currently selected item key |
| `IsOpen` | Boolean (Output) | Whether drawer is expanded |
| `HeaderSelected` | Boolean (Output) | Triggers on header click |

### FluentMessageBar

An inline message bar for displaying alerts and notifications.

**Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `Message` | Text | The message to display |
| `Intent` | Enum | `info`, `success`, `warning`, or `error` |
| `Title` | Text | Optional title above the message |
| `Dismissible` | Boolean | Whether user can dismiss the bar |
| `ActionText` | Text | Optional action button text |
| `IsDismissed` | Boolean (Output) | Triggers when dismissed |
| `ActionClicked` | Boolean (Output) | Triggers when action clicked |

### FluentBreadcrumb

A breadcrumb component for hierarchical navigation. Automatically inherits Power Apps modern theme.

**Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `items` | Dataset | Collection of breadcrumb items (ItemKey, ItemName, ItemIcon) |
| `SelectedKey` | Text (Output) | Key of the clicked breadcrumb item |

## Development

### Prerequisites
- Node.js 18+
- Power Platform CLI (`pac`)

### Build
```bash
npm install
npm run build
```

### Test locally
```bash
npm start
```

### Package solution
```bash
cd Solution
msbuild /t:build /restore
```

The solution `.zip` will be in `Solution/bin/Debug/`.

## License

MIT

## Author

JLG
