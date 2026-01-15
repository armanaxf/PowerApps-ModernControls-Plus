# Fluent UI Toast PCF Component Specification

## Overview

This specification defines the implementation of a Fluent UI v9 Toast component as a Power Apps Component Framework (PCF) virtual control. The component enables app makers to display temporary notification messages (toasts) with various intents, positions, and customization options in Canvas Apps.

> ⚠️ **Accessibility Note**: For fully accessible notifications, developers should also make toast content available on a permanent surface (e.g., a notification center).

## Component Information

- **Namespace**: `FluentToast`
- **Display Name**: Fluent Toast
- **Description**: Fluent UI v9 Toast Component for Canvas Apps
- **Control Type**: `virtual`
- **Version**: 1.0.0

## PCF Architecture

### Platform Requirements

- **React Platform Library**: Version 16.14.0
- **Fluent UI Platform Library**: Version 9.46.2 or higher
- **PCF Type**: Virtual Control (no visual representation in editor)
- **Modern Theming**: Uses Fluent Design Language modern theming API via `context.fluentDesignLanguage.tokenTheme`

### Key Implementation Consideration

The Fluent UI Toast uses an **imperative API** (`dispatchToast`, `dismissToast`, etc.). Since PCF operates declaratively via properties, this component adapts the toast to a property-driven model:

1. Setting `DispatchToast = true` triggers a new toast
2. The component internally manages the Toaster and toast lifecycle
3. Toast dismissal and status changes are exposed via output properties and events

## Control Manifest Properties

### Input Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `DispatchToast` | `TwoOptions` | Yes | No | Set to Yes to dispatch a new toast. Resets automatically after dispatch. |
| `Title` | `SingleLine.Text` | No | "" | Toast title text |
| `BodyText` | `Multiple` | No | "" | Toast body content/message |
| `Subtitle` | `SingleLine.Text` | No | "" | Toast subtitle (displayed in ToastBody) |
| `Intent` | `Enum` | No | info | Toast intent: `success`, `info`, `warning`, `error` |
| `Position` | `Enum` | No | bottom-end | Toast position on screen |
| `Timeout` | `Whole.None` | No | 3000 | Auto-dismiss timeout in milliseconds (-1 for no auto-dismiss) |
| `PauseOnHover` | `TwoOptions` | No | Yes | Pause timeout when mouse hovers over toast |
| `PauseOnWindowBlur` | `TwoOptions` | No | No | Pause timeout when window loses focus |
| `ShowAction` | `TwoOptions` | No | No | Whether to show an action link in the title |
| `ActionText` | `SingleLine.Text` | No | "Dismiss" | Text for the action link |
| `Appearance` | `Enum` | No | default | Toast appearance: `default`, `inverted` |
| `DismissAllToasts` | `TwoOptions` | No | No | Set to Yes to dismiss all visible toasts |
| `MaxToasts` | `Whole.None` | No | 5 | Maximum number of toasts visible at once |

### Output Properties

| Property | Type | Description |
|----------|------|-------------|
| `ToastStatus` | `SingleLine.Text` | Current toast status: "queued", "visible", "dismissed", "unmounted" |
| `LastToastId` | `SingleLine.Text` | ID of the last dispatched toast |
| `ActionClicked` | `TwoOptions` | Set to true when action link is clicked |
| `VisibleToastCount` | `Whole.None` | Number of currently visible toasts |

### Events

| Event | Description |
|-------|-------------|
| `OnToastDispatched` | Fired when a toast is dispatched |
| `OnToastDismissed` | Fired when a toast is dismissed (any reason) |
| `OnActionClick` | Fired when the action link is clicked |
| `OnStatusChange` | Fired when toast status changes (queued, visible, dismissed, unmounted) |

### Enum Definitions

#### Intent Enum
```xml
<enum name="Intent">
  <value name="success" display-name-key="Success" description-key="Success intent (green)">0</value>
  <value name="info" display-name-key="Info" description-key="Informational intent (blue)">1</value>
  <value name="warning" display-name-key="Warning" description-key="Warning intent (yellow)">2</value>
  <value name="error" display-name-key="Error" description-key="Error intent (red)">3</value>
</enum>
```

#### Position Enum
```xml
<enum name="Position">
  <value name="bottom" display-name-key="Bottom" description-key="Bottom center">0</value>
  <value name="bottom-start" display-name-key="Bottom Start" description-key="Bottom left">1</value>
  <value name="bottom-end" display-name-key="Bottom End" description-key="Bottom right">2</value>
  <value name="top" display-name-key="Top" description-key="Top center">3</value>
  <value name="top-start" display-name-key="Top Start" description-key="Top left">4</value>
  <value name="top-end" display-name-key="Top End" description-key="Top right">5</value>
</enum>
```

#### Appearance Enum
```xml
<enum name="Appearance">
  <value name="default" display-name-key="Default" description-key="Default appearance">0</value>
  <value name="inverted" display-name-key="Inverted" description-key="Inverted (dark) appearance">1</value>
</enum>
```

## Component Implementation Structure

### File Structure
```
FluentToast/
├── ControlManifest.Input.xml    # PCF manifest definition
├── index.ts                      # Main PCF control class
├── ToastComponent.tsx            # React component implementation
├── ToastComponent.test.tsx       # Component tests
└── generated/                    # Auto-generated PCF types
    └── ManifestTypes.d.ts
```

### index.ts - PCF Control Class

The main control class must:

1. **Implement `ComponentFramework.ReactControl<IInputs, IOutputs>`**
2. **State Management**:
   - Track toast dispatch trigger
   - Track last toast ID
   - Track toast status
   - Store toaster reference via React ref
   
3. **Init Method**:
   - Initialize state variables
   - Store notifyOutputChanged callback
   - Store context reference

4. **UpdateView Method**:
   - Map PCF inputs to React component props
   - Apply modern theming via `context.fluentDesignLanguage.tokenTheme`
   - Return React element using `React.createElement`
   - Detect DispatchToast edge (false → true) to trigger dispatch
   - Detect DismissAllToasts edge to trigger dismissal

5. **Event Handlers**:
   - `handleToastDispatched(toastId)`: Sets LastToastId, fires OnToastDispatched event
   - `handleToastDismissed()`: Fires OnToastDismissed event
   - `handleActionClick()`: Sets ActionClicked = true, fires OnActionClick event
   - `handleStatusChange(status)`: Updates ToastStatus, fires OnStatusChange event

6. **GetOutputs Method**:
   - Return ToastStatus value
   - Return LastToastId value
   - Return ActionClicked boolean
   - Return VisibleToastCount

### ToastComponent.tsx - React Component

The React component must:

1. **Use FluentProvider with Theme**:
   ```tsx
   <FluentProvider theme={props.theme ?? webLightTheme}>
     <Toaster
       toasterId={toasterId}
       position={props.position}
       timeout={props.timeout}
       limit={props.maxToasts}
       pauseOnHover={props.pauseOnHover}
       pauseOnWindowBlur={props.pauseOnWindowBlur}
     />
     {/* Toast dispatcher logic */}
   </FluentProvider>
   ```

2. **Implement Imperative Toast Dispatch**:
   ```tsx
   const { dispatchToast, dismissAllToasts } = useToastController(toasterId);
   
   useEffect(() => {
     if (props.shouldDispatch) {
       const toastId = generateUniqueId();
       dispatchToast(
         <Toast appearance={props.appearance}>
           <ToastTitle
             action={props.showAction ? (
               <ToastTrigger>
                 <Link onClick={props.onActionClick}>{props.actionText}</Link>
               </ToastTrigger>
             ) : undefined}
           >
             {props.title}
           </ToastTitle>
           {props.bodyText && (
             <ToastBody subtitle={props.subtitle}>{props.bodyText}</ToastBody>
           )}
         </Toast>,
         { 
           intent: props.intent,
           toastId,
           onStatusChange: (e, { status }) => props.onStatusChange(status)
         }
       );
       props.onToastDispatched(toastId);
     }
   }, [props.shouldDispatch]);
   ```

3. **Handle DismissAll**:
   ```tsx
   useEffect(() => {
     if (props.shouldDismissAll) {
       dismissAllToasts();
     }
   }, [props.shouldDismissAll]);
   ```

### Component Props Interface

```typescript
export interface FluentToastProps {
  // Trigger properties
  shouldDispatch: boolean;
  shouldDismissAll: boolean;
  
  // Content properties
  title?: string;
  bodyText?: string;
  subtitle?: string;
  
  // Configuration
  intent: "success" | "info" | "warning" | "error";
  position: "bottom" | "bottom-start" | "bottom-end" | "top" | "top-start" | "top-end";
  timeout: number;
  pauseOnHover: boolean;
  pauseOnWindowBlur: boolean;
  maxToasts: number;
  
  // Action
  showAction: boolean;
  actionText?: string;
  appearance: "default" | "inverted";
  
  // Event handlers
  onToastDispatched: (toastId: string) => void;
  onToastDismissed: () => void;
  onActionClick: () => void;
  onStatusChange: (status: string) => void;
  
  // Theme from PCF
  theme?: Theme;
}
```

## Modern Theming Implementation

The control must support Power Apps modern theming:

```typescript
// In index.ts updateView method
const fluentTheme = (context as any).fluentDesignLanguage?.tokenTheme;

return React.createElement(FluentToastComponent, {
  // ... other props
  theme: fluentTheme,
});
```

## Best Practices Implementation

### Do's ✅

1. **Configure defaults on the Toaster** (position, timeout, pauseOnHover)
2. **Use toasts for non-critical messages only**
3. **Let users view toast content in a notification center after dismissal**
4. **Use `politeness` setting to differentiate urgent/non-urgent messages**
5. **Keep to one position for all toasts** - reduces user confusion

### Don'ts ❌

1. **Don't render too many toasts at once** - use MaxToasts limit
2. **Don't use different positions for toasts** in the same app
3. **Don't make every toast have `assertive` politeness**
4. **Don't use toasts for critical actions** - users might miss them

### Accessibility Considerations

- Toasts use ARIA live regions for screen reader announcements
- `intent` affects the `aria-live` politeness level:
  - `error`/`warning` → `assertive`
  - `success`/`info` → `polite`
- Always provide a way to access toast content after dismissal

## Usage Patterns

### Pattern 1: Simple Success Toast

**Power Apps Configuration**:
- DispatchToast: `varShowToast`
- Title: `"Record saved"`
- Intent: `success`
- Timeout: `3000`

**Power Apps OnSelect (Button)**:
```powerFx
Patch(MyTable, Defaults(MyTable), {Name: "New Record"});
Set(varShowToast, true)
```

### Pattern 2: Error Toast with Action

**Power Apps Configuration**:
- DispatchToast: `varShowError`
- Title: `"Failed to save"`
- BodyText: `"Network connection lost"`
- Intent: `error`
- ShowAction: `true`
- ActionText: `"Retry"`
- Timeout: `-1` (no auto-dismiss)

**Power Apps OnActionClick**:
```powerFx
Set(varShowError, false);
// Retry logic
```

### Pattern 3: Progress/Info Toast

**Power Apps Configuration**:
- Intent: `info`
- Title: `"Uploading file..."`
- BodyText: `Concatenate("Progress: ", Text(varProgress), "%")`
- Timeout: `-1`

## Testing Requirements

### Unit Tests

1. **Rendering Tests**:
   - Toaster renders in correct position
   - Toast displays with correct intent styling
   - Title and body content display correctly

2. **Interaction Tests**:
   - DispatchToast trigger creates new toast
   - Action click fires correct event
   - DismissAll removes all toasts
   - Timeout auto-dismisses toast

3. **Accessibility Tests**:
   - Proper ARIA live region attributes
   - Screen reader announcements work
   - Focus management (keyboard shortcuts)

4. **Theme Tests**:
   - Custom theme applies correctly
   - Falls back to webLightTheme when no theme provided

## Performance Considerations

1. **Toast Limit**: Use `maxToasts` to prevent DOM overflow
2. **Timeout Management**: Default to reasonable timeout (3000ms)
3. **Edge Detection**: Only dispatch on false → true transition
4. **Memory Cleanup**: Ensure proper cleanup in destroy() method

## Known Limitations

1. **No Progress Bar**: Progress toasts require custom implementation (future enhancement)
2. **No Footer Actions**: Footer links not exposed in v1.0 (simplicity)
3. **Single Toaster**: Only one toaster position per component instance
4. **No Inline Mode**: Toasts always render at viewport position

## Future Enhancements (v2.0+)

- [ ] Progress bar support with progress value property
- [ ] Footer actions (multiple action links)
- [ ] Toast update capability (update existing toast content)
- [ ] Custom icon/media slot support
- [ ] Inline toaster mode (relative positioning)
- [ ] Keyboard shortcut configuration for focus
- [ ] Toast queue inspection and management

## References

- [Fluent UI Toast Documentation](https://react.fluentui.dev/?path=/docs/components-toast--docs)
- [PCF Modern Theming API](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/fluent-modern-theming)
- [PCF React Platform Libraries](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/react-controls-platform-libraries)
- [PCF Virtual Controls](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/create-virtual-component)
- [ARIA Live Regions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/#liveregions)

## Complete ControlManifest.Input.xml Template

```xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest>
  <control 
    namespace="FluentToast" 
    constructor="FluentToast" 
    version="1.0.0" 
    display-name-key="FluentToast" 
    description-key="Fluent UI v9 Toast Component for Canvas Apps" 
    control-type="virtual">
    
    <external-service-usage enabled="false" />
    
    <type-group name="IntentGroup">
      <type>Enum</type>
    </type-group>

    <type-group name="PositionGroup">
      <type>Enum</type>
    </type-group>

    <type-group name="AppearanceGroup">
      <type>Enum</type>
    </type-group>
    
    <!-- Input Properties -->
    <property 
      name="DispatchToast" 
      display-name-key="Dispatch Toast" 
      description-key="Set to Yes to dispatch a new toast" 
      of-type="TwoOptions" 
      usage="input" 
      required="true"
      pfx-default-value="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="Title" 
      display-name-key="Title" 
      description-key="Toast title text" 
      of-type="SingleLine.Text" 
      usage="input" 
      required="false" />

    <property 
      name="BodyText" 
      display-name-key="Body Text" 
      description-key="Toast body content/message" 
      of-type="Multiple" 
      usage="input" 
      required="false" />

    <property 
      name="Subtitle" 
      display-name-key="Subtitle" 
      description-key="Toast subtitle" 
      of-type="SingleLine.Text" 
      usage="input" 
      required="false" />

    <property 
      name="Intent" 
      display-name-key="Intent" 
      description-key="Toast intent: success, info, warning, error" 
      of-type-group="IntentGroup" 
      usage="input" 
      required="false" 
      default-value="1"
      pfx-default-value="1">
      <value name="success" display-name-key="Success">0</value>
      <value name="info" display-name-key="Info">1</value>
      <value name="warning" display-name-key="Warning">2</value>
      <value name="error" display-name-key="Error">3</value>
    </property>

    <property 
      name="Position" 
      display-name-key="Position" 
      description-key="Toast position on screen" 
      of-type-group="PositionGroup" 
      usage="input" 
      required="false" 
      default-value="2"
      pfx-default-value="2">
      <value name="bottom" display-name-key="Bottom">0</value>
      <value name="bottomstart" display-name-key="Bottom Start">1</value>
      <value name="bottomend" display-name-key="Bottom End">2</value>
      <value name="top" display-name-key="Top">3</value>
      <value name="topstart" display-name-key="Top Start">4</value>
      <value name="topend" display-name-key="Top End">5</value>
    </property>

    <property 
      name="Timeout" 
      display-name-key="Timeout" 
      description-key="Auto-dismiss timeout in milliseconds (-1 for no auto-dismiss)" 
      of-type="Whole.None" 
      usage="input" 
      required="false" 
      default-value="3000" />

    <property 
      name="PauseOnHover" 
      display-name-key="Pause On Hover" 
      description-key="Pause timeout when mouse hovers over toast" 
      of-type="TwoOptions" 
      usage="input" 
      required="false"
      pfx-default-value="true">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="PauseOnWindowBlur" 
      display-name-key="Pause On Window Blur" 
      description-key="Pause timeout when window loses focus" 
      of-type="TwoOptions" 
      usage="input" 
      required="false"
      pfx-default-value="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="ShowAction" 
      display-name-key="Show Action" 
      description-key="Whether to show an action link in the title" 
      of-type="TwoOptions" 
      usage="input" 
      required="false"
      pfx-default-value="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="ActionText" 
      display-name-key="Action Text" 
      description-key="Text for the action link" 
      of-type="SingleLine.Text" 
      usage="input" 
      required="false" 
      default-value="Dismiss" />

    <property 
      name="Appearance" 
      display-name-key="Appearance" 
      description-key="Toast appearance style" 
      of-type-group="AppearanceGroup" 
      usage="input" 
      required="false" 
      default-value="0"
      pfx-default-value="0">
      <value name="default" display-name-key="Default">0</value>
      <value name="inverted" display-name-key="Inverted">1</value>
    </property>

    <property 
      name="DismissAllToasts" 
      display-name-key="Dismiss All Toasts" 
      description-key="Set to Yes to dismiss all visible toasts" 
      of-type="TwoOptions" 
      usage="input" 
      required="false"
      pfx-default-value="false">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="MaxToasts" 
      display-name-key="Max Toasts" 
      description-key="Maximum number of toasts visible at once" 
      of-type="Whole.None" 
      usage="input" 
      required="false" 
      default-value="5" />
    
    <!-- Output Properties -->
    <property 
      name="ToastStatus" 
      display-name-key="Toast Status" 
      description-key="Current toast status" 
      of-type="SingleLine.Text" 
      usage="output" />

    <property 
      name="LastToastId" 
      display-name-key="Last Toast ID" 
      description-key="ID of the last dispatched toast" 
      of-type="SingleLine.Text" 
      usage="output" />

    <property 
      name="ActionClicked" 
      display-name-key="Action Clicked" 
      description-key="Set to true when action link is clicked" 
      of-type="TwoOptions" 
      usage="output">
      <value name="No" display-name-key="No">0</value>
      <value name="Yes" display-name-key="Yes">1</value>
    </property>

    <property 
      name="VisibleToastCount" 
      display-name-key="Visible Toast Count" 
      description-key="Number of currently visible toasts" 
      of-type="Whole.None" 
      usage="output" />
    
    <!-- Events -->
    <common-event name="OnToastDispatched" />
    <common-event name="OnToastDismissed" />
    <common-event name="OnActionClick" />
    <common-event name="OnStatusChange" />
    
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
- [ ] Create ToastComponent.tsx with FluentProvider and modern theming
- [ ] Implement Toaster with useToastController hook
- [ ] Implement edge detection for DispatchToast property
- [ ] Implement all event handlers (OnToastDispatched, OnToastDismissed, OnActionClick, OnStatusChange)
- [ ] Add support for all four intents (success, info, warning, error)
- [ ] Add support for all six positions
- [ ] Implement DismissAll functionality
- [ ] Apply modern theming via context.fluentDesignLanguage.tokenTheme
- [ ] Write unit tests for component and control
- [ ] Test with Power Apps Canvas App
- [ ] Validate accessibility with screen readers
- [ ] Document usage examples for app makers
