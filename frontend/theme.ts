import { type ThemeConfig, extendTheme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { Rubik } from "next/font/google";

// Import the weights and subsets, add any other config here as well
const nextFont = Rubik({
    weight: ["400", "700"],
    subsets: ["latin"],
});

const config: ThemeConfig = {
    initialColorMode: "system",
    useSystemColorMode: true,
};

const activeLabelStyles = {
    transform: "scale(0.85) translateY(-24px)",
};

const theme = extendTheme({
    config,
    fonts: {
        body: `${nextFont.style.fontFamily}, sans-serif`,
        heading: `${nextFont.style.fontFamily}, sans-serif`,
    },
    colors: {
        brand: {
            500: "#022061",
            900: "#111b31",
        },
        accent: {
            500: "#02AFF0",
            900: "#00141f",
        },
    },
    semanticTokens: {
        colors: {
            primary: {
                default: "brand.500",
                _dark: "accent.900",
            },
            secondary: {
                default: "brand.500",
                _dark: "accent.500",
            },
        },
    },
    components: {
        Button: {
            variants: {
                solid: (props: StyleFunctionProps) => ({
                    color: props.colorMode === "dark" ? "grey.50" : "white",
                    bg: props.colorMode === "dark" ? "accent.500" : "brand.500",
                }),
            },
        },
        Form: {
            variants: {
                floating: (props: StyleFunctionProps) => ({
                    container: {
                        _focusWithin: {
                            label: {
                                ...activeLabelStyles,
                            },
                        },
                        "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
                            {
                                ...activeLabelStyles,
                            },
                        label: {
                            top: 0,
                            left: 0,
                            zIndex: 2,
                            position: "absolute",
                            bg:
                                props.colorMode === "dark"
                                    ? "#1A202C"
                                    : "white",
                            pointerEvents: "none",
                            mx: 3,
                            px: 1,
                            my: 2,
                            transformOrigin: "left top",
                        },
                    },
                }),
            },
        },
    },
});

export default theme;
