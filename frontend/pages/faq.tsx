import { gql, useQuery } from "@apollo/client";
import { Flex, Heading, VStack } from "@chakra-ui/react";

import DisplayError from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { Chakra } from "@/context/Chakra";
import { Faq } from "@/features/faq";

const CURRENT_FAQ = gql`
    query {
        faq(where: { id: 1 }) {
            content {
                document
            }
        }
    }
`;

interface FAQPageProps {
    cookies?: string;
}

export default function FAQPage({ cookies }: FAQPageProps) {
    const { data, loading, error } = useQuery(CURRENT_FAQ);

    if (loading) {
        <Loading cookies={cookies} />;
    }

    if (error) {
        return (
            <Chakra cookies={cookies}>
                <Layout title="FAQ">
                    <DisplayError error={error} />
                </Layout>
            </Chakra>
        );
    }

    const document = data?.faq?.content.document.find(
        (doc) => doc.type === "component-block",
    );

    return (
        <Chakra cookies={cookies}>
            <Layout title="FAQ">
                <Flex flex={{ base: 0, md: 1 }} bg="primary" maxWidth="25%" />
                <Flex
                    p={8}
                    flex={1}
                    align={"center"}
                    justify={"center"}
                    flexDirection={"column"}
                >
                    <VStack
                        spacing={16}
                        alignSelf="center"
                        flex={"1 0 auto"}
                        w="100%"
                    >
                        <Heading
                            color="secondary"
                            textTransform="uppercase"
                            size={{ base: "md", md: "lg", lg: "xl" }}
                            textAlign="center"
                        >
                            Frequently Asked Questions (FAQ)
                        </Heading>

                        <Faq document={document} />
                    </VStack>
                    <Footer />
                </Flex>
            </Layout>
        </Chakra>
    );
}
