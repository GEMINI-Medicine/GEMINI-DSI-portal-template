import {
    Box,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";

import Nav from "@/components/Nav";
import darkLogo from "@/public/logo-greyscale.png";
import logo from "@/public/logo_transparent.png";

export default function MobileMenu({ isOpen, onClose }) {
    const { colorMode } = useColorMode();
    return (
        <Drawer
            isOpen={isOpen}
            placement="left"
            size="full"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
        >
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    <Box w={150}>
                        <Image
                            src={colorMode === "light" ? logo : darkLogo}
                            alt="Logo"
                            placeholder="blur" // Optional blur-up while loading
                        />
                    </Box>
                </DrawerHeader>
                <Nav />
            </DrawerContent>
        </Drawer>
    );
}
