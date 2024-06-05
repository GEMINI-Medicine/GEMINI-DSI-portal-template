import { Flex, Stack } from "@chakra-ui/react";

import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";
import { NotLoggedIn } from "@/features/auth";
import { Policy } from "@/features/policy";
import { Profile } from "@/features/user";
import { useUser } from "@/hooks/index";

interface ProfilePageProps {
    cookies?: string;
}

export default function ProfilePage({ cookies }: ProfilePageProps) {
    const { user, loading } = useUser();
    if (!user && !loading) {
        return (
            <Chakra cookies={cookies}>
                <Layout title="Profile">
                    <NotLoggedIn />
                </Layout>
            </Chakra>
        );
    }

    return (
        <Chakra cookies={cookies}>
            <Layout title="Profile">
                {!user?.policyAccepted && <Policy />}
                <Flex
                    flex={{ base: 0, md: 1 }}
                    bg="primary"
                    maxWidth="25%"
                ></Flex>
                <Flex
                    p={{ base: 8, md: 4 }}
                    flex={1}
                    align={"center"}
                    justify={"center"}
                    flexDirection={"column"}
                    gap={"0.5rem"}
                >
                    <Stack
                        spacing={4}
                        w={"full"}
                        maxW={"md"}
                        flex={"1 0 auto"}
                        justifyContent={"center"}
                    >
                        {user?.role && <Profile user={user} />}
                    </Stack>
                    <Footer />
                </Flex>
            </Layout>
        </Chakra>
    );
}
