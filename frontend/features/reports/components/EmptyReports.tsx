import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Flex,
} from "@chakra-ui/react";

export default function EmptyReports() {
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
                    Looks like you have no reports
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    If you feel this is an error please contact our support team
                </AlertDescription>
            </Alert>
        </Flex>
    );
}
