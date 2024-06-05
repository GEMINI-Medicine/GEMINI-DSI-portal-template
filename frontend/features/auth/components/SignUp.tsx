import { gql, useMutation, useQuery } from "@apollo/client";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";

import DisplayError from "@/components/ErrorMessage";
import { SiteMultiSelect } from "@/features/site";
import { ALL_SITES_QUERY } from "@/features/user";
import { useForm } from "@/hooks/index";
import { SignUpInput, Site } from "types";

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $email: String!
        $name: String!
        $cpso: String
        $sites: [SiteWhereUniqueInput!]
    ) {
        createUser(
            data: {
                email: $email
                name: $name
                cpso: $cpso
                sites: { connect: $sites }
            }
        ) {
            id
            email
            name
            role {
                id
                name
            }
        }
    }
`;

interface SignupProps {
    setIsLogInView: () => void;
}

interface SitesResult {
    sites: Array<Site>;
}

export default function SignUp({ setIsLogInView }: SignupProps) {
    const toast = useToast();
    const { inputs, handleChange, resetForm } = useForm<SignUpInput>({
        email: "",
        name: "",
        cpso: "",
        sites: [],
    });
    const { data: sites, loading: sitesLoading } =
        useQuery<SitesResult>(ALL_SITES_QUERY);
    const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
        variables: {
            ...inputs,
            email: inputs.email.toLowerCase().trim(),
            name: inputs.name.trim(),
            cpso: inputs.cpso?.trim() === "" ? null : inputs.cpso?.trim(),
            sites: inputs.sites?.map((site: Site) => {
                return { id: site.id };
            }),
        },
    });

    useEffect(() => {
        // This function runs when the things we are watching change
        if (data && data.createUser) {
            toast({
                title: "Success!",
                description: `Signed up with ${data.createUser.email} - Once
                                    your account is validated you will be sent
                                    an email with further instructions on how to
                                    log in`,
                status: "success",
                duration: 9000,
                variant: "solid",
                isClosable: true,
                position: "top",
            });
        }
    }, [data]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // stop the form from submitting
        await signup().catch(console.error);

        resetForm();
    }

    let emailTakenError = "";

    if (error && error.message) {
        if (
            error.message.includes(
                "Unique constraint failed on the fields: (`email`)",
            )
        ) {
            emailTakenError =
                "It looks like an account already exists, if you believe that this is in error, please contact our support team.";
        }
    }

    return (
        <>
            <Box textAlign="center">
                <Heading color="secondary" textTransform="uppercase" size="2xl">
                    Welcome
                </Heading>
                <Text mt="2.5">
                    Please fill in your information to register.
                </Text>
            </Box>
            <Box>
                <form method="POST" onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        <DisplayError
                            error={{
                                message: emailTakenError,
                            }}
                        />
                        <Alert status="info" variant="left-accent">
                            <AlertIcon />
                            <AlertDescription>
                                When you register, our team will validate
                                your account and provide you with access to the
                                portal. This process may take a few days
                            </AlertDescription>
                        </Alert>

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
                        </FormControl>
                        <FormControl
                            isRequired
                            isDisabled={loading}
                            variant="floating"
                        >
                            <Input
                                size="lg"
                                borderRadius="2rem"
                                id="name"
                                name="name"
                                type="text"
                                placeholder=" "
                                value={inputs.name}
                                onChange={handleChange}
                            />
                            <FormLabel htmlFor="name">Full Name</FormLabel>
                        </FormControl>
                        <FormControl isDisabled={loading} variant="floating">
                            <Input
                                size="lg"
                                borderRadius="2rem"
                                id="cpso"
                                name="cpso"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{5,6}"
                                placeholder=" "
                                value={inputs.cpso}
                                onChange={handleChange}
                            />
                            <FormLabel htmlFor="cpso">CPSO</FormLabel>
                            <FormHelperText>
                                A valid CPSO is 5-6 numbers long
                            </FormHelperText>
                        </FormControl>
                        <FormControl isDisabled={loading}>
                            <SiteMultiSelect
                                options={sites?.sites}
                                isLoading={sitesLoading}
                                value={inputs.sites}
                                handleChange={handleChange}
                            />
                            <FormHelperText>
                                Select the hospitals you are affiliated with
                            </FormHelperText>
                        </FormControl>
                        <VStack spacing="6">
                            <Button
                                size="lg"
                                type="submit"
                                isLoading={loading}
                                loadingText="Registering"
                                colorScheme="brand"
                                borderRadius="2rem"
                                w="100%"
                            >
                                Register
                            </Button>
                            <Button onClick={setIsLogInView} variant="link">
                                Already have an account? Log in
                            </Button>
                        </VStack>
                    </VStack>
                </form>
            </Box>
        </>
    );
}
