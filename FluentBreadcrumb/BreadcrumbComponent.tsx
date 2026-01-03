import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider,
    FluentProvider,
    webLightTheme,
    makeStyles,
    Overflow,
    OverflowItem,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    Button,
    useIsOverflowItemVisible,
    useOverflowMenu,
} from "@fluentui/react-components";
import { MoreHorizontalRegular, HomeRegular, FolderRegular, DocumentRegular } from "@fluentui/react-icons";

export interface BreadcrumbItemData {
    key: string;
    name: string;
    icon?: string;
}

export interface FluentBreadcrumbProps {
    items: BreadcrumbItemData[];
    onItemSelect: (key: string) => void;
}

const useStyles = makeStyles({
    root: {
        width: "100%",
        display: "flex",
        alignItems: "center",
    },
});

// Icon map for commonly used breadcrumb icons - keeps bundle small
const iconMap: Record<string, React.FC> = {
    HomeRegular: HomeRegular,
    FolderRegular: FolderRegular,
    DocumentRegular: DocumentRegular,
};

// Helper to resolve icons from the limited set
const resolveIcon = (iconName?: string): React.JSX.Element | undefined => {
    if (!iconName) return undefined;
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
        return <IconComponent />;
    }
    return undefined;
};

// Component for individual breadcrumb items that can overflow
interface OverflowBreadcrumbItemProps {
    item: BreadcrumbItemData;
    isLast: boolean;
    onItemSelect: (key: string) => void;
}

const OverflowBreadcrumbItem: React.FC<OverflowBreadcrumbItemProps> = ({ item, isLast, onItemSelect }) => {
    const Icon = resolveIcon(item.icon);
    return (
        <OverflowItem id={item.key} priority={isLast ? 1000 : undefined}>
            <span style={{ display: "inline-flex", alignItems: "center" }}>
                <BreadcrumbItem>
                    <BreadcrumbButton
                        icon={Icon}
                        onClick={() => onItemSelect(item.key)}
                        current={isLast}
                    >
                        {item.name}
                    </BreadcrumbButton>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbDivider />}
            </span>
        </OverflowItem>
    );
};

// Menu item for overflowed breadcrumb items
interface OverflowMenuItemProps {
    itemKey: string;
    name: string;
    onItemSelect: (key: string) => void;
}

const OverflowMenuItem: React.FC<OverflowMenuItemProps> = ({ itemKey, name, onItemSelect }) => {
    const isVisible = useIsOverflowItemVisible(itemKey);

    if (isVisible) {
        return null;
    }

    return (
        <MenuItem onClick={() => onItemSelect(itemKey)}>
            {name}
        </MenuItem>
    );
};

// Overflow menu trigger
interface OverflowMenuProps {
    items: BreadcrumbItemData[];
    onItemSelect: (key: string) => void;
}

const OverflowMenu: React.FC<OverflowMenuProps> = ({ items, onItemSelect }) => {
    const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();

    if (!isOverflowing) {
        return null;
    }

    return (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
            <BreadcrumbItem>
                <Menu>
                    <MenuTrigger>
                        <Button
                            ref={ref}
                            appearance="subtle"
                            icon={<MoreHorizontalRegular />}
                            aria-label="More breadcrumb items"
                        />
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            {items.map((item) => (
                                <OverflowMenuItem
                                    key={item.key}
                                    itemKey={item.key}
                                    name={item.name}
                                    onItemSelect={onItemSelect}
                                />
                            ))}
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </BreadcrumbItem>
            <BreadcrumbDivider />
        </span>
    );
};

export const FluentBreadcrumbComponent: React.FC<FluentBreadcrumbProps> = (props) => {
    const { items, onItemSelect } = props;
    const styles = useStyles();

    return (
        <FluentProvider theme={webLightTheme} style={{ background: "transparent", width: "100%" }}>
            <Overflow>
                <Breadcrumb aria-label="Breadcrumb" className={styles.root}>
                    <OverflowMenu items={items} onItemSelect={onItemSelect} />
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <OverflowBreadcrumbItem
                                key={item.key}
                                item={item}
                                isLast={isLast}
                                onItemSelect={onItemSelect}
                            />
                        );
                    })}
                </Breadcrumb>
            </Overflow>
        </FluentProvider>
    );
};
