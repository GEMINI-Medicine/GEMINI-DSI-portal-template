import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    IconButton,
    IconButtonProps,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcher = (props: ColorModeSwitcherProps) => {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue("dark", "light");
    const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);

    return (
        <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            color="current"
            onClick={toggleColorMode}
            icon={<SwitchIcon />}
            aria-label={`Switch to ${text} mode`}
            {...props}
        />
    );
};
