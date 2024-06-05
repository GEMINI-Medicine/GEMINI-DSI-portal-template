import {
    Box,
    Divider,
    Flex,
    Link,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Fragment } from "react";

import { NextChakraLink } from "@/components/NextChakraLink";

const LINKS = [
    {
        text: "Privacy Policy",
        href: "privacy.policy.url",
    },
    {
        text: "General Terms and Conditions",
        href: "terms.and.conditions.url",
    },
];

function generateExternalLinks() {
    return LINKS.map((link, index) => (
        <Fragment key={index}>
            <Text
                fontSize={["0.5em", "0.7em", "0.8em"]}
                textTransform={"uppercase"}
            >
                <Link href={link.href} isExternal>
                    {link.text}
                </Link>
            </Text>
            <Divider
                orientation="vertical"
                borderColor={useColorModeValue("gray.800", "white")}
                height={"60%"}
            />
        </Fragment>
    ));
}

export default function Footer() {
    return (
        <Box
            as="footer"
            bg={useColorModeValue("white", "gray.800")}
            px={4}
            flexShrink={0}
        >
            <Flex
                h={8}
                alignItems={"start"}
                justifyContent={"space-between"}
                gap={4}
            >
                <Text
                    fontSize={["0.5em", "0.7em", "0.8em"]}
                    textTransform={"uppercase"}
                >
                    &#169; 2024 Unity health Toronto. All rights reserved
                </Text>
                <Divider
                    orientation="vertical"
                    borderColor={useColorModeValue("gray.800", "white")}
                    height={"60%"}
                />
                {generateExternalLinks()}
                <NextChakraLink href="/policy">
                    <Text
                        fontSize={["0.5em", "0.7em", "0.8em"]}
                        textTransform={"uppercase"}
                        _hover={{
                            textDecoration: "underline",
                        }}
                    >
                        Additional Terms of Use
                    </Text>
                </NextChakraLink>
            </Flex>
        </Box>
    );
}
