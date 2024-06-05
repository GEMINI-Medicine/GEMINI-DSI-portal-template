import { ChevronDownIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    Avatar,
    AvatarBadge,
    Box,
    Button,
    Center,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    Text,
    VStack,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { differenceInHours, parseISO } from "date-fns";
import Image from "next/image";

import { ColorModeSwitcher } from "@/components/ColorModeSwitcher";
import MobileMenu from "@/components/MobileMenu";
import Nav from "@/components/Nav";
import { NextChakraLink } from "@/components/NextChakraLink";
import { LogOut } from "@/features/auth";
import { Search } from "@/features/search";
import { useRequests, useUser } from "@/hooks/index";
import darkLogo from "@/public/logo-greyscale.png";
import logo from "@/public/logo_transparent.png";
import { Request, User } from "types";

function getStatusColor(status: string, updatedAt: string) {
    let statusColor = "inherit";
    if (status && updatedAt) {
        const diff = differenceInHours(Date.now(), parseISO(updatedAt));
        if (diff >= 24 && status !== "OUTSTANDING") {
            return statusColor;
        }
    }

    switch (status) {
        case "OUTSTANDING":
            statusColor = "yellow.500";
            break;
        case "APPROVED":
            statusColor = "green.500";
            break;
        case "DECLINED":
            statusColor = "red.500";
            break;
        default:
            statusColor = "inherit";
            break;
    }

    return statusColor;
}

interface RightSideHeaderProps {
    user: User | undefined;
    requests: Request[] | [];
}

function RightSideHeader({ user, requests }: RightSideHeaderProps) {
    if (user && user.role) {
        const statusColor = getStatusColor(
            requests[0]?.status,
            requests[0]?.updatedAt,
        );

        return (
            <Menu>
                <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                    py={2}
                    transition="all 0.3s"
                    _focus={{ boxShadow: "none" }}
                >
                    <HStack>
                        <Avatar size={"sm"} bg="brand.500">
                            <AvatarBadge boxSize="1.25em" bg={statusColor} />
                        </Avatar>
                        <VStack
                            display={{
                                base: "none",
                                md: "flex",
                            }}
                            alignItems="flex-start"
                            spacing="1px"
                            ml="2"
                        >
                            <Text fontSize="sm">{user.name}</Text>
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
                <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                        <Avatar size={{ base: "md", md: "2xl" }} bg="brand.500">
                            <AvatarBadge boxSize="1.25em" bg={statusColor} />
                        </Avatar>
                    </Center>
                    <br />
                    <Center>
                        <p>{user.name}</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>
                        <NextChakraLink href="/profile" w="100%">
                            Profile
                        </NextChakraLink>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem>
                        <LogOut />
                    </MenuItem>
                </MenuList>
            </Menu>
        );
    }
    return <NextChakraLink href="/login">Log In</NextChakraLink>;
}

interface LeftSideHeaderProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

function LeftSideHeader({ isOpen, onOpen, onClose }: LeftSideHeaderProps) {
    const { colorMode } = useColorMode();
    return (
        <>
            <IconButton
                size={"md"}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={"Open Menu"}
                display={{ md: "none" }}
                onClick={isOpen ? onClose : onOpen}
                variant="outline"
            />
            <HStack spacing={8} alignItems={"center"}>
                <Box w={{ base: 150, md: 200 }}>
                    <Image
                        src={colorMode === "light" ? logo : darkLogo}
                        alt="Logo"
                        placeholder="blur" // Optional blur-up while loading
                    />
                </Box>
                <HStack
                    as={"nav"}
                    spacing={4}
                    display={{ base: "none", md: "flex" }}
                >
                    <Nav />
                </HStack>
            </HStack>
        </>
    );
}

interface SearchBarProps {
    user: User | undefined;
}

function SearchBar({ user }: SearchBarProps) {
    if (user && user.role) {
        return (
            <Box pb={4}>
                <Search />
            </Box>
        );
    }
    return null;
}

export default function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useUser();
    const { requests } = useRequests(user);

    return (
        <Box bg={useColorModeValue("white", "gray.800")} px={4} height={"7rem"}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                <LeftSideHeader
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                />
                <Stack direction={"row"} spacing={7} align={"center"}>
                    <ColorModeSwitcher />
                    <RightSideHeader user={user} requests={requests} />
                </Stack>
            </Flex>
            <MobileMenu isOpen={isOpen} onClose={onClose} />
            <SearchBar user={user} />
        </Box>
    );
}
