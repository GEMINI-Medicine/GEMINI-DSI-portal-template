import { useMutation } from "@apollo/client";
import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stat,
    StatNumber,
    Text,
} from "@chakra-ui/react";
import { MouseEvent } from "react";

import { SIGN_OUT_MUTATION } from "@/features/auth";
import { CURRENT_USER_QUERY } from "@/hooks/index";

interface SessionTimeoutProps {
    remaining: number;
    openModal: boolean;
    handleStillHere: () => void;
}

export default function SessionTimeout({
    remaining,
    openModal,
    handleStillHere,
}: SessionTimeoutProps) {
    const [signout] = useMutation(SIGN_OUT_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });
    const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Do something
        signout();
    };
    return (
        <Modal
            closeOnOverlayClick={false}
            isCentered
            isOpen={openModal}
            onClose={handleStillHere}
            size={"xl"}
        >
            <ModalOverlay
                bg="none"
                backdropFilter="auto"
                backdropInvert="80%"
                backdropBlur="2px"
            />
            <ModalContent>
                <ModalHeader bg={"orange"}>Session Timeout</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction={"column"} gap={"1rem"}>
                        <Text>Your online session will expire in:</Text>
                        <Stat>
                            <StatNumber>
                                {new Date(remaining * 1000)
                                    .toISOString()
                                    .slice(14, 19)}
                            </StatNumber>
                        </Stat>
                        <Text as="b" color="orange">
                            We do this to keep your information secure
                        </Text>
                        <Text>
                            Please click &quot;Continue&quot; to keep working
                        </Text>
                        <Text>
                            Or click &quot;Log Off&quot; to end your session
                            now.
                        </Text>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleStillHere} mr={3}>
                        Continue
                    </Button>
                    <Button onClick={handleLogout} variant={"outline"}>
                        Log off
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
