import { Flex, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useBoolean } from "usehooks-ts";

import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";
import { LogIn, SignUp } from "@/features/auth";
import { useUser } from "@/hooks/index";

interface LogInPageProps {
    cookies?: string;
}

export default function LogInPage({ cookies }: LogInPageProps) {
    const { value, toggle } = useBoolean(true);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    return (
        <Chakra cookies={cookies}>
            <Layout title="Log In">
                <Flex
                    flex={{ base: 0, md: 1 }}
                    bg="primary"
                    maxWidth="25%"
                ></Flex>
                <Flex
                    p={8}
                    flex={1}
                    align="center"
                    justify="center"
                    flexDirection="column"
                    gap="0.5rem"
                >
                    <Stack
                        spacing={4}
                        w="full"
                        maxW="md"
                        flex="1 0 auto"
                        justifyContent="center"
                    >
                        {value ? (
                            <LogIn setIsLogInView={toggle} />
                        ) : (
                            <SignUp setIsLogInView={toggle} />
                        )}
                    </Stack>
                    <Footer />
                </Flex>
            </Layout>
        </Chakra>
    );
}
