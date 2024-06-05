import { gql, useMutation, useQuery } from "@apollo/client";
import {
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
import { ALL_REQUESTS_QUERY, useForm, useRequests } from "@/hooks/index";
import { User, updateProfileInput } from "types";

import RequestStatus from "./RequestStatus";

const CREATE_NEW_REQUEST = gql`
    mutation CREATE_NEW_REQUEST(
        $type: String!
        $description: JSON
        $userID: ID
    ) {
        createRequest(
            data: {
                type: $type
                description: $description
                user: { connect: { id: $userID } }
            }
        ) {
            id
        }
    }
`;

export const ALL_SITES_QUERY = gql`
    query ALL_SITES_QUERY {
        sites {
            id
            name
            siteID
        }
    }
`;

interface ProfileProps {
    user: User;
}

export default function Profile({ user }: ProfileProps) {
    const toast = useToast();
    const { requests } = useRequests(user);
    const { data: sites, loading: sitesLoading } = useQuery(ALL_SITES_QUERY);

    const isOutstanding = requests[0]?.status === "OUTSTANDING";

    const updateData = isOutstanding
        ? requests[0].description
        : {
              name: user.name,
              email: user.email,
              cpso: user.cpso,
              sites: user.sites,
          };
    const { inputs, handleChange } = useForm<updateProfileInput>({
        email: updateData.email || "",
        name: updateData.name || "",
        cpso: updateData.cpso || "",
        sites: updateData.sites || [],
    });

    const [update, { data, loading, error }] = useMutation(CREATE_NEW_REQUEST, {
        variables: {
            type: "PROFILE",
            description: {
                ...inputs,
                email: inputs.email.toLowerCase().trim(),
                name: inputs.name.trim(),
                cpso: inputs.cpso?.trim() === "" ? null : inputs.cpso?.trim(),
            },
            userID: user.id,
        },
        refetchQueries: [ALL_REQUESTS_QUERY],
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // stop the form from submitting
        await update().catch(console.error);
    }

    useEffect(() => {
        // This function runs when the things we are watching change
        if (data && data.createRequest) {
            toast({
                title: "Request Recieved!",
                description:
                    "Our support team will see your request and approve or decline your request",
                status: "success",
                duration: 18000,
                variant: "solid",
                isClosable: true,
                position: "top",
            });
        }
    }, [data]);

    if (!user || !user.role) {
        return null;
    }

    return (
        <>
            <Box textAlign="center">
                <Heading color="secondary" textTransform="uppercase">
                    Profile
                </Heading>
                <Text mt="2.5">
                    To change your profile, please edit the field and then click
                    request update
                </Text>
            </Box>
            <Box>
                <form method="POST" onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        {requests.length ? (
                            <RequestStatus
                                status={requests[0].status}
                                updatedAt={requests[0].updatedAt}
                            />
                        ) : null}
                        <DisplayError error={error} />
                        <FormControl
                            isRequired
                            isDisabled={loading || isOutstanding}
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
                            isDisabled={loading || isOutstanding}
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
                        <FormControl
                            isDisabled={loading || isOutstanding}
                            variant="floating"
                        >
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
                        <FormControl isDisabled={loading || isOutstanding}>
                            <FormLabel htmlFor="sites">Hospital(s)</FormLabel>
                            <SiteMultiSelect
                                options={sites?.sites}
                                isLoading={sitesLoading}
                                isDisabled={isOutstanding}
                                value={inputs.sites}
                                handleChange={handleChange}
                            />
                            <FormHelperText>
                                Select the hospitals you work at
                            </FormHelperText>
                        </FormControl>
                        <Button
                            size="lg"
                            type="submit"
                            isLoading={loading}
                            isDisabled={isOutstanding}
                            loadingText="Requesting Update"
                            colorScheme="brand"
                            borderRadius="2rem"
                            w="100%"
                        >
                            Request Update!
                        </Button>
                    </VStack>
                </form>
            </Box>
        </>
    );
}
