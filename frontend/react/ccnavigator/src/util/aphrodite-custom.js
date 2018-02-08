import { StyleSheet as DefaultStyleSheet } from "aphrodite/no-important";

/**
 * extend stylesheet to work with tag names
 */
const selectorHandler = (selector, _, generateSubtreeStyles) => {
    if (selector[0] !== "*") {
        return null;
    }
    return generateSubtreeStyles(selector.slice(1));
};
const extension = {selectorHandler: selectorHandler};
const CustomStyleSheet = DefaultStyleSheet.extend([extension]);

export const StyleSheet = CustomStyleSheet.StyleSheet;
export const css = CustomStyleSheet.css;
