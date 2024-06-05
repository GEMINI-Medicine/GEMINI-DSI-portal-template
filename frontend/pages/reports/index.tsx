import { Flex, Progress, Stack } from "@chakra-ui/react";
import { useBoolean } from "usehooks-ts";

import DisplayError from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";
import { LogIn, SignUp } from "@/features/auth";
import { Policy } from "@/features/policy";
import { Reports } from "@/features/reports";
import { useUser } from "@/hooks/index";
import { User } from "types";

interface ReportsPageProps {
    cookies?: string;
}

function showReports(
    user: User | undefined,
    value: boolean,
    toggle: () => void,
) {
    if (user && user.role) {
        if (user.policyAccepted) {
            return <Reports username={user.name} />;
        }

        return <Policy />;
    }
    return (
        <>
            <Flex flex={{ base: 0, md: 1 }} bg="primary" maxWidth="25%"></Flex>
            <Flex
                p={8}
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
                    {value ? (
                        <LogIn setIsLogInView={toggle} />
                    ) : (
                        <SignUp setIsLogInView={toggle} />
                    )}
                </Stack>
                <Footer />
            </Flex>
        </>
    );
}

export default function ReportsPage({ cookies }: ReportsPageProps) {
    const { value, toggle } = useBoolean(true);
    const { user, loading } = useUser();

    if (loading) {
        return (
            <Chakra cookies={cookies}>
                <Progress size="md" isIndeterminate color="brand.500" />
            </Chakra>
        );
    }

    if (user && !user.role) {
        return (
            <Chakra cookies={cookies}>
                <Layout title="Dashboard">
                    <DisplayError
                        error={{
                            message:
                                "You have not been assigned a user access type yet. Please contact our support team",
                        }}
                    />
                </Layout>
            </Chakra>
        );
    }
    let title = "Log In";

    if (user && user.role) {
        title = "Dashboard";
    }

    return (
        <Chakra cookies={cookies}>
            <Layout title={title}>{showReports(user, value, toggle)}</Layout>
        </Chakra>
    );
}
