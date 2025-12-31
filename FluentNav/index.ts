import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentNavComponent, NavItemData } from "./NavComponent";
import * as React from "react";

export class FluentNav implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedKey = "";
    private isOpen = true;
    private headerSelected = false;
    private context: ComponentFramework.Context<IInputs>;

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready
     * @param state A piece of data that persists in one session for a single user
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
    }

    /**
     * Map the PowerApps dataset to NavItemData array
     */
    private mapDatasetToNavItems(context: ComponentFramework.Context<IInputs>): NavItemData[] {
        const dataset = context.parameters.navItems;
        const items: NavItemData[] = [];

        if (!dataset?.sortedRecordIds || dataset.sortedRecordIds.length === 0) {
            return items;
        }

        for (const recordId of dataset.sortedRecordIds) {
            const record = dataset.records[recordId];

            // Extract values using the property-set names
            const itemKey = (record.getValue("ItemKey") as string) ?? recordId;
            const itemName = (record.getValue("ItemName") as string) ?? "";
            const itemIcon = record.getValue("ItemIcon") as string | undefined;
            const itemParentKey = record.getValue("ItemParentKey") as string | undefined;

            items.push({
                key: itemKey,
                name: itemName,
                icon: itemIcon ?? undefined,
                parentKey: itemParentKey ?? undefined,
            });
        }

        return items;
    }

    /**
     * Handle selection change from the Nav component
     */
    private handleSelectionChange = (newSelectedKey: string): void => {
        this.selectedKey = newSelectedKey;
        this.notifyOutputChanged();
    };

    /**
     * Handle open/close state change from the Nav component
     */
    private handleOpenChange = (newIsOpen: boolean): void => {
        this.isOpen = newIsOpen;
        this.notifyOutputChanged();
    };

    /**
     * Handle header click from the Nav component
     */
    private handleHeaderSelect = (): void => {
        // Toggle the headerSelected state to trigger PowerApps event
        this.headerSelected = !this.headerSelected;
        this.notifyOutputChanged();
    };

    /**
     * Called when any value in the property bag has changed.
     * @param context The entire property bag available to control via Context Object
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.context = context;

        // Map dataset to nav items
        const navItems = this.mapDatasetToNavItems(context);

        // Get properties
        const defaultSelectedKey = context.parameters.DefaultSelectedKey?.raw ?? undefined;
        const headerTitle = context.parameters.HeaderTitle?.raw ?? undefined;
        const headerIcon = context.parameters.HeaderIcon?.raw ?? undefined;
        const headerImageUrl = context.parameters.HeaderImageUrl?.raw ?? undefined;

        return React.createElement(FluentNavComponent, {
            items: navItems,
            selectedKey: this.selectedKey ? this.selectedKey : undefined,
            defaultSelectedKey: defaultSelectedKey,
            onSelectionChange: this.handleSelectionChange,
            onOpenChange: this.handleOpenChange,
            onHeaderSelect: this.handleHeaderSelect,
            headerTitle: headerTitle,
            headerIcon: headerIcon,
            headerImageUrl: headerImageUrl,
            isOpen: this.isOpen,
        });
    }

    /**
     * Returns output properties
     * @returns object based on nomenclature defined in manifest
     */
    public getOutputs(): IOutputs {
        return {
            SelectedKey: this.selectedKey,
            IsOpen: this.isOpen,
            HeaderSelected: this.headerSelected,
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree.
     */
    public destroy(): void {
        // Cleanup if necessary
    }
}
