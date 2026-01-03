import * as React from "react";
import {
    Card,
    CardHeader,
    CardPreview,
    CardFooter,
    Text,
    Button,
    Checkbox,
    CheckboxOnChangeData,
    makeStyles,
    tokens,
    FluentProvider,
    webLightTheme,
} from "@fluentui/react-components";

export type CardAppearance = "filled" | "filled-alternative" | "outline" | "subtle";

export interface FluentCardProps {
    title: string;
    subtitle?: string;
    bodyContent?: string;
    image?: string;
    size: "small" | "medium" | "large";
    orientation: "vertical" | "horizontal";
    appearance: CardAppearance;
    selectable: boolean;
    floatingAction: boolean;
    actionButtonText?: string;
    selected: boolean;
    onSelect: (selected: boolean) => void;
    onClick: () => void;
    onActionClick: () => void;
}

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    card: {
        width: "100%",
        height: "100%",
    },
    horizontalCard: {
        display: "flex",
        flexDirection: "row",
    },
    preview: {
        backgroundColor: tokens.colorNeutralBackground3,
    },
    previewImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    horizontalPreview: {
        width: "140px",
        minWidth: "140px",
    },
    body: {
        padding: "0 12px 12px 12px",
    },
    footer: {
        marginTop: "auto",
    },
    caption: {
        color: tokens.colorNeutralForeground3,
    },
    checkbox: {
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 1,
    }
});

export const FluentCardComponent: React.FC<FluentCardProps> = (props) => {
    const {
        title,
        subtitle,
        bodyContent,
        image,
        size,
        orientation,
        appearance,
        selectable,
        floatingAction,
        actionButtonText,
        selected,
        onSelect,
        onClick,
        onActionClick,
    } = props;

    const styles = useStyles();

    const handleClick = React.useCallback(() => {
        onClick();
        if (selectable && !floatingAction) {
            onSelect(!selected);
        }
    }, [onClick, selectable, floatingAction, selected, onSelect]);

    const handleActionClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onActionClick();
    }, [onActionClick]);

    const handleCheckboxChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => {
        e.stopPropagation();
        onSelect(!!data.checked);
    }, [onSelect]);

    const isHorizontal = orientation === "horizontal";

    return (
        <FluentProvider theme={webLightTheme} style={{ background: "transparent", width: "100%", height: "100%" }}>
            <div className={styles.root}>
                <Card
                    appearance={appearance}
                    className={isHorizontal ? styles.horizontalCard : styles.card}
                    selected={selectable ? selected : undefined}
                    onSelectionChange={selectable && !floatingAction ? (_, data) => onSelect(data.selected) : undefined}
                    onClick={handleClick}
                    size={size === "small" ? "small" : "medium"} // sizing in v9 is limited to small/medium
                >
                    {selectable && floatingAction && (
                        <div className={styles.checkbox}>
                            <Checkbox
                                checked={selected}
                                onChange={handleCheckboxChange}
                                size="large"
                            />
                        </div>
                    )}

                    {image && (
                        <CardPreview className={isHorizontal ? styles.horizontalPreview : styles.preview}>
                            <img
                                src={image}
                                alt={title}
                                className={styles.previewImage}
                                onError={(e) => {
                                    // Log error for debugging
                                    console.warn('FluentCard: Image failed to load. Source:', image);
                                    // Hide broken image
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                                onLoad={() => {
                                    console.log('FluentCard: Image loaded successfully');
                                }}
                            />
                        </CardPreview>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <CardHeader
                            header={<Text weight="semibold">{title}</Text>}
                            description={subtitle ? <Text size={200} className={styles.caption}>{subtitle}</Text> : undefined}
                        />

                        {bodyContent && (
                            <div className={styles.body}>
                                <Text>{bodyContent}</Text>
                            </div>
                        )}

                        {actionButtonText && (
                            <CardFooter className={styles.footer}>
                                <Button appearance="primary" onClick={handleActionClick}>
                                    {actionButtonText}
                                </Button>
                            </CardFooter>
                        )}
                    </div>
                </Card>
            </div>
        </FluentProvider>
    );
};
