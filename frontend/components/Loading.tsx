import { Flex, Spinner } from "@chakra-ui/react";

import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";

interface LoadingProps {
    cookies?: string;
    title?: string;
}

export function Loading({ cookies, title = "" }: LoadingProps) {
    return (
        <Chakra cookies={cookies}>
            <Layout title={title}>
                <Flex flex={{ base: 0, md: 1 }} bg="primary" />
                <Flex
                    p={8}
                    flex={1}
                    align="center"
                    justify="center"
                    flexDirection="column"
                >
                    <Spinner />
                </Flex>
            </Layout>
        </Chakra>
    );
}
