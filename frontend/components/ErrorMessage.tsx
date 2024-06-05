import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";

interface ErrorProps {
    error: any;
}

const Error = ({ error }: ErrorProps) => {
    return (
        <Alert status="error" variant="left-accent" maxHeight="5rem">
            <AlertIcon />
            <AlertTitle>Server Error</AlertTitle>
            <AlertDescription>
                {error.message
                    .replace("GraphQL error: ", "")
                    .replace("Prisma error: ", "")}
            </AlertDescription>
        </Alert>
    );
};

const DisplayError = ({ error }: ErrorProps) => {
    if (!error || !error.message) return null;
    if (
        error.networkError &&
        error.networkError.result &&
        error.networkError.result.errors &&
        error.networkError.result.errors.length
    ) {
        return error.networkError.result.errors.map((error, i) => (
            <Error key={i} error={error} />
        ));
    }
    return <Error error={error} />;
};

export default DisplayError;
