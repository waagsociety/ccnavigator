import { StyleSheet } from "aphrodite";

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
const { StyleSheet: ExtendedStyleSheet, css: newCss } = StyleSheet.extend([extension]);
/**
 * global styles
 */
export const Style = ExtendedStyleSheet.create({
    globals: {
        '*body': {
            background: '#2ae',
            margin: '0'
        },
    }
});
/*
 * generate global css
 */
newCss(Style.globals);
