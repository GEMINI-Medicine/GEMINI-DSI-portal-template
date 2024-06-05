import { Card, CardBody, Text } from "@chakra-ui/react";
import { DocumentRenderer } from "@keystone-6/document-renderer";

import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";
import { renderers, usePolicy } from "@/hooks/index";

interface PolicyProps {
    cookies?: string;
}

export default function PolicyPage({ cookies }: PolicyProps) {
    const policy = usePolicy();
    return (
        <Chakra cookies={cookies}>
            <Layout title="Privacy Policy">
                <Card flexGrow={1} m={8} variant="unstyled">
                    <CardBody>
                        {policy ? (
                            <DocumentRenderer
                                document={policy.content.document}
                                renderers={renderers}
                            />
                        ) : (
                            <Text fontSize="6xl" color="accent.500">
                                Missing User Agreement Document. Please contact our support team.
                            </Text>
                        )}
                    </CardBody>
                </Card>
            </Layout>
        </Chakra>
    );
}
