import { gql, useQuery } from "@apollo/client";
import {
    Heading,
    Link,
    ListItem,
    OrderedList,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import { DocumentRendererProps } from "@keystone-6/document-renderer";

const CURRENT_POLICY = gql`
    query {
        policy(where: { id: 1 }) {
            content {
                document
            }
        }
    }
`;

export const renderers: DocumentRendererProps["renderers"] = {
    // use your editor's autocomplete to see what other renderers you can override
    inline: {
        link({ href, children }) {
            return (
                <Link href={href} isExternal color="accent.500">
                    {children}
                </Link>
            );
        },
    },
    block: {
        heading({ level, children, textAlign }) {
            switch (level) {
                case 1:
                    return (
                        <Heading as="h1" size="3xl" textAlign={textAlign} p={4}>
                            {children}
                        </Heading>
                    );
                case 2:
                    return (
                        <Heading as="h2" size="xl" textAlign={textAlign} p={4}>
                            {children}
                        </Heading>
                    );
                case 3:
                    return (
                        <Heading as="h3" size="lg" textAlign={textAlign} p={4}>
                            {children}
                        </Heading>
                    );
                case 4:
                    return (
                        <Heading as="h4" size="md" textAlign={textAlign} p={4}>
                            {children}
                        </Heading>
                    );
                case 5:
                    return (
                        <Heading as="h5" size="sm" textAlign={textAlign} p={4}>
                            {children}
                        </Heading>
                    );
                case 6:
                    return (
                        <Heading as="h6" size="xs" textAlign={textAlign} p={4}>
                            {children}
                        </Heading>
                    );

                default:
                    return (
                        <Heading textAlign={textAlign} p={4}>
                            {children}
                        </Heading>
                    );
            }
        },
        paragraph({ children, textAlign }) {
            return (
                <Text textAlign={textAlign} p={4}>
                    {children}
                </Text>
            );
        },
        list({ children, type }) {
            if (type === "ordered") {
                return (
                    <OrderedList p={4}>
                        {children.map((child, index) => (
                            <ListItem margin={"10px 0"} key={index}>
                                {child}
                            </ListItem>
                        ))}
                    </OrderedList>
                );
            }
            return (
                <UnorderedList p={4}>
                    {children.map((child, index) => (
                        <ListItem key={index} margin={"10px 0"}>
                            {child}
                        </ListItem>
                    ))}
                </UnorderedList>
            );
        },
    },
};

export default function usePolicy() {
    const { data } = useQuery(CURRENT_POLICY);

    return data?.policy;
}
