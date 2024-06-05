import { gql, useQuery } from "@apollo/client";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { DocumentRenderer } from "@keystone-6/document-renderer";

import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";
import { renderers } from "@/hooks/index";

interface AboutPageProps {
    cookies?: string;
}

const CURRENT_ABOUT = gql`
    query {
        about(where: { id: 1 }) {
            content {
                document
            }
        }
    }
`;
export default function AboutPage({ cookies }: AboutPageProps) {
    const { data } = useQuery(CURRENT_ABOUT);
    return (
        <Chakra cookies={cookies}>
            <Layout title="About">
                <Flex flex={{ base: 0, md: 1 }} bg="primary" maxWidth="25%" />
                <Flex
                    p={8}
                    flex={1}
                    align={"center"}
                    justify={"center"}
                    flexDirection={"column"}
                >
                    <VStack spacing={16} alignSelf="center" flex={"1 0 auto"}>
                        <Box position="relative">
                            {data?.about ? (
                                <DocumentRenderer
                                    document={data.about.content.document}
                                    renderers={renderers}
                                />
                            ) : null}
                        </Box>
                    </VStack>
                    <Footer />
                </Flex>
            </Layout>
        </Chakra>
    );
}
