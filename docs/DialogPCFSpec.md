# Fluent UI Dialog PCF Component Specification

## Overview

This specification defines the implementation of a Fluent UI v9 Dialog component as a Power Apps Component Framework (PCF) virtual control. The component enables app makers to display modal, non-modal, and alert dialogs with comprehensive customization options in Canvas Apps.

## Component Information

- **Namespace**: `FluentDialog`
- **Display Name**: Fluent Dialog
- **Description**: Fluent UI v9 Dialog Component for Canvas Apps
- **Control Type**: `virtual`
- **Version**: 1.0.0

## PCF Architecture

### Platform Requirements

- **React Platform Library**: Version 16.14.0
- **Fluent UI Platform Library**: Version 9.46.2 or higher
- **PCF Type**: Virtual Control (no visual representation in editor)
- **Modern Theming**: Uses Fluent Design Language modern theming API via `context.fluentDesignLanguage.tokenTheme`

## Control Manifest Properties

### Input Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `IsOpen` | `TwoOptions` | Yes | No | Controls whether the dialog is currently open |
| `ModalType` | `Enum` | No | modal | Dialog variation: `modal`, `non-modal`, or `alert` |
| `Title` | `SingleLine.Text` | No | "" | Dialog title text |
| `ContentText` | `Multiple` | No | "" | Main dialog content/message |
| `PrimaryButtonText` | `SingleLine.Text` | No | "OK" | Text for primary action button |
| `SecondaryButtonText` | `SingleLine.Text` | No | "Cancel" | Text for secondary action button |
| `ShowPrimaryButton` | `TwoOptions` | No | Yes | Whether to show the primary button |
| `ShowSecondaryButton` | `TwoOptions` | No | Yes | Whether to show the secondary button |
| `ShowCloseButton` | `TwoOptions` | No | Auto | Whether to show close button in title (auto = true for non-modal) |
| `UnmountOnClose` | `TwoOptions` | No | Yes | Whether to remove dialog from DOM when closed (important for SSR) |
| `ActionsPosition` | `Enum` | No | end | Position of action buttons: `start` or `end` |
| `FluidActions` | `TwoOptions` | No | No | Whether actions should span full width |

### Output Properties

| Property | Type | Description |
|----------|------|-------------|
| `UserAction` | `SingleLine.Text` | Last action taken by user: "primary", "secondary", "close", or "dismiss" |
| `DialogClosed` | `TwoOptions` | Indicates if dialog was closed (triggers on any close action) |

### Events

| Event | Description |
|-------|-------------|
| `OnPrimaryAction` | Fired when primary button is clicked |
| `OnSecondaryAction` | Fired when secondary button is clicked |
| `OnClose` | Fired when dialog is closed by any means (X button, backdrop, escape) |
| `OnOpenChange` | Fired whenever dialog open state changes |

### Enum Definitions

#### ModalType Enum
```xml
<enum name="ModalType">
  <value name="modal" display-name-key="Modal" description-key="Standard modal dialog (default)">0</value>
  <value name="non-modal" display-name-key="Non-Modal" description-key="Non-modal dialog (no backdrop dimming)">1</value>
  <value name="alert" display-name-key="Alert" description-key="Alert dialog (must be dismissed via button)">2</value>
</enum>
```

#### ActionsPosition Enum
```xml
<enum name="ActionsPosition">
  <value name="start" display-name-key="Start" description-key="Position actions at start">0</value>
  <value name="end" display-name-key="End" description-key="Position actions at end">1</value>
</enum>
```

## Component Implementation Structure

### File Structure
```
FluentDialog/
├── ControlManifest.Input.xml    # PCF manifest definition
├── index.ts                      # Main PCF control class
├── DialogComponent.tsx           # React component implementation
├── DialogComponent.test.tsx      # Component tests
└── generated/                    # Auto-generated PCF types
    └── ManifestTypes.d.ts
```

### index.ts - PCF Control Class

The main control class must:

1. **Implement `ComponentFramework.ReactControl<IInputs, IOutputs>`**
2. **State Management**:
   - Track current dialog open state
   - Track last user action
   - Store context reference
   
3. **Init Method**:
   - Initialize state variables
   - Store notifyOutputChanged callback
   - Store context reference

4. **UpdateView Method**:
   - Map PCF inputs to React component props
   - Apply modern theming via `context.fluentDesignLanguage.tokenTheme`
   - Return React element using `React.createElement`
   - Handle controlled component pattern for `IsOpen` property

5. **Event Handlers**:
   - `handlePrimaryAction()`: Sets UserAction = "primary", fires OnPrimaryAction event
   - `handleSecondaryAction()`: Sets UserAction = "secondary", fires OnSecondaryAction event
   - `handleClose()`: Sets UserAction based on close trigger, fires OnClose event
   - `handleOpenChange()`: Manages open state changes, fires OnOpenChange event

6. **GetOutputs Method**:
   - Return current UserAction value
   - Return DialogClosed boolean

### DialogComponent.tsx - React Component

The React component must:

1. **Use FluentProvider with Theme**:
   ```tsx
   <FluentProvider theme={props.theme ?? webLightTheme}>
     {/* Dialog content */}
   </FluentProvider>
   ```

2. **Implement Controlled Dialog Pattern**:
   ```tsx
   <Dialog 
     open={props.isOpen}
     onOpenChange={handleOpenChange}
     modalType={props.modalType}
     unmountOnClose={props.unmountOnClose}
   >
   ```

3. **Handle Dialog Structure**:
   - Use `DialogSurface` as surface container
   - Use `DialogBody` to wrap all content
   - Use `DialogTitle` with optional action slot
   - Use `DialogContent` for main content
   - Use `DialogActions` for buttons with configurable position

4. **Accessibility**:
   - Set `aria-describedby` on `DialogSurface` for simple dialogs
   - Set `aria-describedby={undefined}` for complex content
   - Ensure proper focus management
   - Support keyboard navigation (Escape to close)

5. **Action Buttons**:
   - Render primary button when `showPrimaryButton` is true
   - Render secondary button when `showSecondaryButton` is true
   - Use `DialogTrigger` wrapper for close behaviors
   - Support fluid actions layout

### Component Props Interface

```typescript
export interface FluentDialogProps {
  isOpen: boolean;
  modalType: "modal" | "non-modal" | "alert";
  title?: string;
  contentText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showPrimaryButton: boolean;
  showSecondaryButton: boolean;
  showCloseButton?: boolean;
  unmountOnClose: boolean;
  actionsPosition: "start" | "end";
  fluidActions: boolean;
  
  // Event handlers
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  onClose: (reason: "close" | "dismiss" | "escape") => void;
  onOpenChange: (isOpen: boolean) => void;
  
  // Theme from PCF
  theme?: Theme;
}
```

## Modern Theming Implementation

The control must support Power Apps modern theming:

```typescript
// In index.ts updateView method
const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

return React.createElement(FluentDialogComponent, {
  // ... other props
  theme: fluentTheme,
});
```

## Best Practices Implementation

### Do's ✅

1. **Always include DialogBody, DialogTitle, DialogContent, and DialogActions**
2. **Limit to maximum 3 buttons in DialogActions**
3. **Use modal sparingly** - only for critical decisions or irreversible actions
4. **Add `aria-describedby` for simple confirmation dialogs**
5. **Add `aria-label` or `aria-labelledby` if no DialogTitle**
6. **Set `unmountOnClose={true}` by default** (important for SSR environments)

### Don'ts ❌

1. **Don't open Dialog from Dialog** - not supported
2. **Don't create Dialog with no focusable elements** - accessibility issue
3. **Don't use more than 3 buttons** - reduces clarity

### Special Accessibility Considerations

For dialogs containing Menu, Combobox, Dropdown, or Popover components:
```tsx
<DialogSurface aria-modal={false}>
  {/* Ensures VoiceOver on iOS/macOS can access popups */}
</DialogSurface>
```

## Usage Patterns

### Pattern 1: Simple Confirmation Dialog

**Power Apps Configuration**:
- IsOpen: `varShowConfirm`
- ModalType: `modal`
- Title: `"Confirm Delete"`
- ContentText: `"Are you sure you want to delete this item?"`
- PrimaryButtonText: `"Delete"`
- SecondaryButtonText: `"Cancel"`

**Power Apps OnPrimaryAction**: 
```powerFx
Remove(Collection, SelectedItem);
Set(varShowConfirm, false)
```

### Pattern 2: Alert Dialog (Non-dismissable via backdrop)

**Power Apps Configuration**:
- ModalType: `alert`
- Title: `"Error Occurred"`
- ContentText: `"Unable to save changes. Please try again."`
- ShowSecondaryButton: `false`
- PrimaryButtonText: `"OK"`

### Pattern 3: Non-Modal Dialog

**Power Apps Configuration**:
- ModalType: `non-modal`
- Title: `"Quick Actions"`
- ShowCloseButton: `true` (automatic for non-modal)

## Testing Requirements

### Unit Tests

1. **Rendering Tests**:
   - Dialog renders with correct modalType
   - Title and content display correctly
   - Buttons render based on show/hide flags

2. **Interaction Tests**:
   - Primary button click fires correct event
   - Secondary button click fires correct event
   - Close button works (non-modal)
   - Backdrop click works (modal)
   - Escape key closes dialog

3. **Accessibility Tests**:
   - Proper ARIA attributes
   - Focus trap works in modal
   - Keyboard navigation
   - Screen reader announcements

4. **Theme Tests**:
   - Custom theme applies correctly
   - Falls back to webLightTheme when no theme provided

## Performance Considerations

1. **UnmountOnClose**: Default to `true` to prevent SSR hydration issues
2. **Focus Management**: Use `useRestoreFocusTarget` if needed for complex scenarios
3. **Event Throttling**: Consider debouncing rapid open/close toggles
4. **Memory Cleanup**: Ensure proper cleanup in destroy() method

## Known Limitations

1. **Nested Dialogs**: Cannot open dialog from another dialog (Fluent UI limitation)
2. **Custom Content**: Limited to text content (no rich HTML in PCF properties)
3. **Animation Control**: `surfaceMotion` and `backdropMotion` not exposed (could be added in future version)
4. **Backdrop Customization**: Backdrop customization not exposed in v1.0

## Future Enhancements (v2.0+)

- [ ] Support for custom HTML content via data-set
- [ ] Form integration pattern with validation
- [ ] Motion/animation customization properties
- [ ] Icon support in title and buttons
- [ ] Size presets (small, medium, large)
- [ ] Scrollable long content detection and optimization
- [ ] Change focus target customization

## References

- [Fluent UI Dialog Documentation](https://react.fluentui.dev/?path=/docs/components-dialog--default)
- [PCF Modern Theming API](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/fluent-modern-theming)
- [PCF React Platform Libraries](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/react-controls-platform-libraries)
- [PCF Virtual Controls](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/create-virtual-component)
- [ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Complete ControlManifest.Input.xml Template

```xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest>
  <control 
    namespace="FluentDialog" 
    constructor="FluentDialog" 
    version="1.0.0" 
    display-name-key="FluentDialog" 
    description-key="Fluent UI v9 Dialog Component for Canvas Apps" 
    control-type="virtual">
    
    <external-service-usage enabled="false" />
    
    <type-group name="ModalTypeGroup">
      <type>Enum</type>
    </type-group>

    <type-group name="ActionsPositionGroup">
      <type>Enum</type>
    </type-group>
    
    <!-- Input Properties -->
    <property 
      name="IsOpen" 
      display-name-key="Is Open" 
      description-key="Controls whether the dialog is open" 
      of-type="TwoOptions" 
      usage="input" 
      required="true">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="ModalType" 
      display-name-key="Modal Type" 
      description-key="Type of dialog: modal, non-modal, or alert" 
      of-type-group="ModalTypeGroup" 
      usage="input" 
      required="false" 
      default-value="0">
      <value name="modal" display-name-key="Modal">0</value>
      <value name="nonmodal" display-name-key="Non-Modal">1</value>
      <value name="alert" display-name-key="Alert">2</value>
    </property>

    <property 
      name="Title" 
      display-name-key="Title" 
      description-key="Dialog title text" 
      of-type="SingleLine.Text" 
      usage="input" 
      required="false" />

    <property 
      name="ContentText" 
      display-name-key="Content Text" 
      description-key="Main dialog content/message" 
      of-type="Multiple" 
      usage="input" 
      required="false" />

    <property 
      name="PrimaryButtonText" 
      display-name-key="Primary Button Text" 
      description-key="Text for primary action button" 
      of-type="SingleLine.Text" 
      usage="input" 
      required="false" 
      default-value="OK" />

    <property 
      name="SecondaryButtonText" 
      display-name-key="Secondary Button Text" 
      description-key="Text for secondary action button" 
      of-type="SingleLine.Text" 
      usage="input" 
      required="false" 
      default-value="Cancel" />

    <property 
      name="ShowPrimaryButton" 
      display-name-key="Show Primary Button" 
      description-key="Whether to show the primary button" 
      of-type="TwoOptions" 
      usage="input" 
      required="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="ShowSecondaryButton" 
      display-name-key="Show Secondary Button" 
      description-key="Whether to show the secondary button" 
      of-type="TwoOptions" 
      usage="input" 
      required="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="ShowCloseButton" 
      display-name-key="Show Close Button" 
      description-key="Whether to show close button in title (auto for non-modal)" 
      of-type="TwoOptions" 
      usage="input" 
      required="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="UnmountOnClose" 
      display-name-key="Unmount On Close" 
      description-key="Remove dialog from DOM when closed (recommended for SSR)" 
      of-type="TwoOptions" 
      usage="input" 
      required="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="ActionsPosition" 
      display-name-key="Actions Position" 
      description-key="Position of action buttons" 
      of-type-group="ActionsPositionGroup" 
      usage="input" 
      required="false" 
      default-value="1">
      <value name="start" display-name-key="Start">0</value>
      <value name="end" display-name-key="End">1</value>
    </property>

    <property 
      name="FluidActions" 
      display-name-key="Fluid Actions" 
      description-key="Whether actions should span full width" 
      of-type="TwoOptions" 
      usage="input" 
      required="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>
    
    <!-- Output Properties -->
    <property 
      name="UserAction" 
      display-name-key="User Action" 
      description-key="Last action taken by user" 
      of-type="SingleLine.Text" 
      usage="output" />

    <property 
      name="DialogClosed" 
      display-name-key="Dialog Closed" 
      description-key="Indicates if dialog was closed" 
      of-type="TwoOptions" 
      usage="output">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>
    
    <!-- Events -->
    <common-event name="OnPrimaryAction" />
    <common-event name="OnSecondaryAction" />
    <common-event name="OnClose" />
    <common-event name="OnOpenChange" />
    
    <resources>
      <code path="index.ts" order="1"/>
      <platform-library name="React" version="16.14.0" />
      <platform-library name="Fluent" version="9.46.2" />
    </resources>
  </control>
</manifest>
```

## Implementation Checklist

- [ ] Create ControlManifest.Input.xml with all properties and events
- [ ] Implement index.ts with ReactControl interface
- [ ] Create DialogComponent.tsx with FluentProvider and modern theming
- [ ] Implement all event handlers (OnPrimaryAction, OnSecondaryAction, OnClose, OnOpenChange)
- [ ] Add support for all three modal types (modal, non-modal, alert)
- [ ] Implement accessibility features (ARIA attributes, focus management)
- [ ] Handle controlled component pattern for IsOpen property
- [ ] Apply modern theming via context.fluentDesignLanguage.tokenTheme
- [ ] Write unit tests for component and control
- [ ] Test with Power Apps Canvas App
- [ ] Validate accessibility with screen readers
- [ ] Document usage examples for app makers
