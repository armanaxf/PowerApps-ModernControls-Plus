import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FluentBreadcrumbComponent, BreadcrumbItemData } from "./BreadcrumbComponent";
import * as React from "react";

export class FluentBreadcrumb implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedKey = "";

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    private handleItemSelect = (key: string): void => {
        this.selectedKey = key;
        this.notifyOutputChanged();
    };

    private mapDatasetToItems(context: ComponentFramework.Context<IInputs>): BreadcrumbItemData[] {
        const dataset = context.parameters.items;
        const items: BreadcrumbItemData[] = [];

        if (!dataset?.sortedRecordIds) return items;

        for (const recordId of dataset.sortedRecordIds) {
            const record = dataset.records[recordId];
            items.push({
                key: (record.getValue("ItemKey") as string) ?? recordId,
                name: (record.getValue("ItemName") as string) ?? "",
                icon: (record.getValue("ItemIcon") as string) ?? undefined,
            });
        }
        return items;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const items = this.mapDatasetToItems(context);

        return React.createElement(FluentBreadcrumbComponent, {
            items: items,
            onItemSelect: this.handleItemSelect
        });
    }

    public getOutputs(): IOutputs {
        return {
            SelectedKey: this.selectedKey
        };
    }

    public destroy(): void {
        // Cleanup
    }
}
