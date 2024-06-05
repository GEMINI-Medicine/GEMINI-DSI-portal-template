import { Flex, FlexProps, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { NextChakraLink } from "@/components/NextChakraLink";

interface LinkItemProps {
    name: string;
    href: string;
}

interface NavItemProps extends FlexProps {
    href: string;
    children: React.ReactNode;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
];

const NavItem = ({ href, children, ...rest }: NavItemProps) => {
    const router = useRouter();
    const bg = useColorModeValue("gray.200", "gray.700");
    return (
        <NextChakraLink
            href={href}
            _hover={{
                textDecoration: "none",
                bg: bg,
            }}
        >
            <Flex
                align="center"
                p="4"
                borderRadius="lg"
                backgroundColor={router.pathname === href ? bg : "inherit"}
                {...rest}
            >
                {children}
            </Flex>
        </NextChakraLink>
    );
};

export default function Nav() {
    return (
        <>
            {LinkItems.map((link) => (
                <NavItem key={link.name} href={link.href}>
                    {link.name}
                </NavItem>
            ))}
        </>
    );
}
