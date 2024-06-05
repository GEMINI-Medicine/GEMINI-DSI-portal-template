import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Flex,
} from "@chakra-ui/react";

import { NextChakraLink } from "@/components/NextChakraLink";

export default function NotLoggedIn() {
    return (
        <Flex flex={1}>
            <Alert
                status="warning"
                variant="top-accent"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
            >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Access Denied
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    Looks like you are not logged in. Please{" "}
                    <NextChakraLink href="/login" textDecoration={"underline"}>
                        log in
                    </NextChakraLink>{" "}
                    to access this page
                </AlertDescription>
            </Alert>
        </Flex>
    );
}
