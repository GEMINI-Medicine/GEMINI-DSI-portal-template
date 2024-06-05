import { gql, useMutation } from "@apollo/client";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";

import DisplayError from "@/components/ErrorMessage";
import { useForm } from "@/hooks/index";
import { LogInInput } from "types";

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!) {
        sendUserMagicAuthLink(email: $email)
    }
`;

type LogInProps = {
    setIsLogInView: () => void;
};

export default function LogIn({ setIsLogInView }: LogInProps) {
    const toast = useToast();
    const { inputs, handleChange, resetForm } = useForm<LogInInput>({
        email: "",
    });
    const [login, { data, error, loading }] = useMutation<{
        sendUserMagicAuthLink: LogInInput;
    }>(SIGNIN_MUTATION, {
        variables: {
            ...inputs,
            email: inputs.email.toLowerCase().trim(),
        },
    });

    useEffect(() => {
        // This function runs when the things we are watching change
        if (data && data.sendUserMagicAuthLink) {
            toast({
                title: "Log in request received",
                description:
                    "If an account exists, you will receive a magic link to your email address. This may take up to 10 minutes to receive. If you requested multiple links, only the most recent one will be valid.",
                status: "success",
                duration: 18000,
                variant: "solid",
                isClosable: true,
                position: "top",
            });
        }
    }, [data]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // stop the form from submitting
        await login().catch(console.error);
        resetForm();
    }

    let errorLogin: { message: string } | null = null;
    if (data) {
        errorLogin = data.sendUserMagicAuthLink
            ? null
            : { message: "Something Went wrong" };
    }

    return (
        <>
            <Box textAlign="center">
                <Heading color="secondary" textTransform="uppercase" size="2xl">
                    Welcome
                </Heading>
                <Text mt="2.5">
                    Get a magic link sent to your hospital email to log you in
                    instantly
                </Text>
            </Box>
            <Box>
                <form method="POST" onSubmit={handleSubmit} aria-busy={loading}>
                    <VStack spacing={4} align="stretch">
                        <Alert status="info" variant="left-accent">
                            <AlertIcon />
                            <AlertDescription>
                                For some email servers, the magic link can take
                                up to 10 minutes to arrive into your inbox.
                                <p>
                                    If you requested multiple magic links, only
                                    the most recent one will be valid
                                </p>
                            </AlertDescription>
                        </Alert>

                        <DisplayError error={error || errorLogin} />
                        <FormControl
                            isRequired
                            isDisabled={loading}
                            variant="floating"
                        >
                            <Input
                                size="lg"
                                borderRadius="2rem"
                                id="email"
                                name="email"
                                type="email"
                                placeholder=" "
                                value={inputs.email}
                                onChange={handleChange}
                            />
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormErrorMessage>
                                Name is required
                            </FormErrorMessage>
                        </FormControl>
                        <VStack spacing="6">
                            <Button
                                size="lg"
                                type="submit"
                                isLoading={loading}
                                loadingText="Sending Magic Link"
                                colorScheme="brand"
                                borderRadius="2rem"
                                w="100%"
                            >
                                Send Magic Link
                            </Button>

                            <Button onClick={setIsLogInView} variant="link">
                                Register for an account.
                            </Button>
                        </VStack>
                    </VStack>
                </form>
            </Box>
        </>
    );
}
