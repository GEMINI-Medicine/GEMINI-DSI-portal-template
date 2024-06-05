import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    BoxProps,
    Center,
    CloseButton,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    VStack,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";

import { ColorModeSwitcher } from "@/components/ColorModeSwitcher";
import Nav from "@/components/Nav";
import { NextChakraLink } from "@/components/NextChakraLink";
import { LogOut } from "@/features/auth";
import { Search } from "@/features/search";
import { useUser } from "@/hooks/index";
import darkLogo from "@/public/logo-greyscale.png";
import logo from "@/public/logo_transparent.png";

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const { colorMode } = useColorMode();
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                <Box w={{ base: 150, md: 200 }}>
                    <Image
                        src={colorMode === "light" ? logo : darkLogo}
                        alt="Logo"
                        placeholder="blur" // Optional blur-up while loading
                    />
                </Box>

                <CloseButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onClose}
                />
            </Flex>
            <Nav />
        </Box>
    );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { colorMode } = useColorMode();
    const bg = useColorModeValue("white", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const matches = useMediaQuery("(min-width: 80em)");
    const { user } = useUser();

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="3em"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            position={{ base: "fixed", md: "inherit" }}
            top={{ base: "0", md: "inherit" }}
            width={{ base: "100%", md: "inherit" }}
            zIndex={10}
            {...rest}
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<HamburgerIcon />}
            />

            <Box
                display={{ base: "flex", md: "none" }}
                w={{ base: 120, md: 200 }}
            >
                <Image
                    src={colorMode === "light" ? logo : darkLogo}
                    alt="Logo"
                    placeholder="blur" // Optional blur-up while loading
                />
            </Box>

            <HStack width={{ base: "auto", md: "100%" }}>
                {user?.role && matches ? <Search /> : null}
                <HStack
                    width="100%"
                    spacing={{ base: "0", md: "5" }}
                    justifyContent="flex-end"
                >
                    <ColorModeSwitcher />
                    <Flex alignItems={"center"}>
                        {user?.role ? (
                            <Menu>
                                <MenuButton
                                    py={2}
                                    transition="all 0.3s"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    <HStack>
                                        <Avatar size={"sm"} bg="brand.500" />
                                        <VStack
                                            display={{
                                                base: "none",
                                                md: "flex",
                                            }}
                                            alignItems="flex-start"
                                            spacing="1px"
                                            ml="2"
                                        >
                                            <Text fontSize="sm">
                                                {user.name}
                                            </Text>
                                        </VStack>
                                        <Box
                                            display={{
                                                base: "none",
                                                md: "flex",
                                            }}
                                        >
                                            <ChevronDownIcon />
                                        </Box>
                                    </HStack>
                                </MenuButton>
                                <MenuList
                                    alignItems={"center"}
                                    bg={bg}
                                    borderColor={borderColor}
                                >
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={{ base: "md", md: "2xl" }}
                                            bg="brand.500"
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <Text zIndex={2}>{user.name}</Text>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem>
                                        <NextChakraLink href="/profile">
                                            Profile
                                        </NextChakraLink>
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem>
                                        <LogOut />
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <NextChakraLink href="/login">
                                Log In
                            </NextChakraLink>
                        )}
                    </Flex>
                </HStack>
            </HStack>
        </Flex>
    );
};

const SidebarWithHeader = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: "none", md: "block" }}
            />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
        </>
    );
};

export default SidebarWithHeader;
