import { gql, useMutation } from "@apollo/client";
import {
    Button,
    Checkbox,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { DocumentRenderer } from "@keystone-6/document-renderer";

import DisplayError from "@/components/ErrorMessage";
import {
    CURRENT_USER_QUERY,
    renderers,
    useForm,
    usePolicy,
    useUser,
} from "@/hooks/index";
import { consentToPolicyInput } from "types";

const CONSENT_TO_POLICY = gql`
    mutation CONSENT_TO_POLICY(
        $where: UserWhereUniqueInput!
        $data: UserUpdateInput!
    ) {
        updateUser(where: $where, data: $data) {
            id
            email
        }
    }
`;

export default function Policy() {
    const { onClose } = useDisclosure();
    const { user } = useUser();
    const { inputs, handleChange } = useForm<consentToPolicyInput>({
        policyAccepted: user?.policyAccepted || false,
    });
    const [consent, { data: policyData, loading: policyLoading, error }] =
        useMutation(CONSENT_TO_POLICY, {
            variables: {
                where: {
                    id: user?.id,
                },
                data: {
                    ...inputs,
                },
            },
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
    const policy = usePolicy();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // stop the form from submitting
        await consent().catch(console.error);
    }

    return (
        <Drawer
            onClose={onClose}
            isOpen={!policyData?.updateUser && !user?.policyAccepted}
            size={"full"}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody p={16}>
                    {policy ? (
                        <>
                            <DocumentRenderer
                                document={policy.content.document}
                                renderers={renderers}
                            />
                            <form method="POST" onSubmit={handleSubmit}>
                                <Stack spacing={4}>
                                    <DisplayError error={error} />
                                    <Checkbox
                                        size="lg"
                                        colorScheme="orange"
                                        value={inputs.policyAccepted ? 0 : 1}
                                        onChange={handleChange}
                                        name="policyAccepted"
                                        borderColor="black"
                                    >
                                        By ticking this box I agree that I have
                                        read the user agreement
                                    </Checkbox>

                                    <Button
                                        size="lg"
                                        type="submit"
                                        isLoading={policyLoading}
                                        loadingText="Accepting Policy"
                                        colorScheme="brand"
                                        borderRadius="2rem"
                                        w="100%"
                                        isDisabled={!inputs.policyAccepted}
                                    >
                                        Continue
                                    </Button>
                                </Stack>
                            </form>
                        </>
                    ) : (
                        <Text fontSize="6xl" color="accent.500">
                            Missing User Agreement Document. Please Contact
                            our support team
                        </Text>
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
