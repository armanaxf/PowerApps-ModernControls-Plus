# PowerApps Modern Controls Plus

A suite of professional, **Fluent UI v9** based PCF components for Power Apps Canvas Apps. These components provide a premium look and feel, matching the modern Microsoft design language.

## 📦 Components Included

| Component | Description |
|-----------|-------------|
| **FluentBreadcrumb** | A navigation trail for hierarchical pages. |
| **FluentMessageBar** | A notification/alert bar with various intents (Success, Error, Warning, Info). |

| **FluentDialog** | A modal/non-modal dialog for confirmations, alerts, and forms. |
| **FluentToast** | Temporary notification messages that auto-dismiss. |

---

## 🚀 Installation

1. Download the latest `Solution.zip` from the [Releases](https://github.com/armanaxf/PowerApps-ModernControls-Plus/releases) page.
2. Go to the **Power Apps Maker Portal** (make.powerapps.com).
3. Navigate to **Solutions** -> **Import solution**.
4. Select the `Solution.zip` file (Managed recommended for Prod, Unmanaged for Dev) and import.
5. In your Canvas App editor, go to **Insert** -> **Get more components** -> **Code**.
6. Search for the component name (e.g., "FluentDialog") and import it.

---

## 📖 Component Reference

### 1. FluentBreadcrumb

A navigation trail for hierarchical data.

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Items` | Table | Yes | The collection of breadcrumbs. |

**Items Table Schema:**
| Column | Type | Description |
|--------|------|-------------|
| `ItemKey` | Text | Unique identifier for the item. |
| `ItemName` | Text | Text to display. |
| `ItemIcon` | Text | (Optional) Fluent Icon name. |

**Events:**
- `OnSelect`: Fires when a breadcrumb item is clicked. Use `FluentBreadcrumb.Selected` to get the clicked key.

**Example:**
```powerfx
// Items Property
Table(
    {ItemKey: "home", ItemName: "Home", ItemIcon: "Home"},
    {ItemKey: "settings", ItemName: "Settings", ItemIcon: "Settings"}
)

// OnSelect
Notify("Navigating to " & Self.Selected)
```

---

### 2. FluentMessageBar

Display inline status messages to the user.

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Message` | Text | `"Message"` | Main text content. |
| `Intent` | Enum | `"info"` | `info`, `success`, `warning`, `error`. |
| `Title` | Text | - | Optional bold title above the message. |
| `Dismissible` | Boolean | `false` | If true, shows a close button. |
| `ActionText` | Text | - | Text for an optional action button. |

**Events:**
- `OnDismiss`: Fires when the close button is clicked.
- `OnAction`: Fires when the action button is clicked.

**Outputs:**
- `ActionClicked`: Boolean indicating if action was triggered.

---



### 4. FluentDialog

A modal dialog for confirmations, alerts, and user interactions.

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `IsOpen` | Boolean | `false` | Controls visibility. Bind to a variable. |
| `ModalType` | Enum | `"modal"` | `modal` (blocking), `nonmodal`, `alert`. |
| `Title` | Text | `"Title"` | Dialog header. |
| `ContentText` | Text | - | Main message body. |
| `PrimaryButtonText` | Text | `"OK"` | Primary action label. |
| `SecondaryButtonText` | Text | `"Cancel"`| Secondary action label. |
| `ShowPrimaryButton` | Boolean | `true` | Show/hide primary button. |
| `ShowSecondaryButton` | Boolean | `true` | Show/hide secondary button. |

**Events:**
- `OnPrimaryAction`: Primary button clicked.
- `OnSecondaryAction`: Secondary button clicked.
- `OnClose`: Dialog closed via X or background click.

---

### 5. FluentToast

Temporary notification messages that auto-dismiss. The Toast component manages its own queue.

> **Note**: Place this component once in your app (e.g., inside a Component Container or on screen) with sufficient size (min 400x200px) as it renders alerts within its boundary.

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `DispatchToast` | Boolean | `false` | Toggle `false` -> `true` to show a new toast. |
| `Title` | Text | `"Notification"` | Toast header. |
| `BodyText` | Text | - | Toast message. |
| `Intent` | Enum | `"info"` | `info`, `success`, `warning`, `error`. |
| `Position` | Enum | `"bottom-end"` | `top`, `bottom`, `bottom-end` (default), etc. |
| `Timeout` | Number | `3000` | Duration in ms. Set `-1` to disable auto-dismiss. |
| `MaxToasts` | Number | `5` | Max visible toasts at once. |

**Events:**
- `OnToastDispatched`: Fires when a toast appears.
- `OnToastDismissed`: Fires when a toast disappears.

---

## 🛠 Build & Development

```bash
# Install Dependencies
npm install

# Build Components
npm run build

# Package Solution
dotnet build Solution/Solution.cdsproj --configuration Release
```

---

*Maintained by the Community*
