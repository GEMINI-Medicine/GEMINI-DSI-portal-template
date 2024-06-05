import path from "path";

import { gql, useQuery } from "@apollo/client";
import { ViewIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import { useMediaQuery } from "usehooks-ts";

import DisplayError from "@/components/ErrorMessage";

import DownloadReport from "./DownloadReport";

export const SINGLE_REPORT_QUERY = gql`
    query SINGLE_REPORT_QUERY($id: ID!) {
        report(where: { id: $id }) {
            id
            title
            updatedAt
        }
    }
`;

const REQUEST_PRESIGNED_URL = gql`
    query REQUEST_PRESIGNED_URL($objectName: String!) {
        requestPresignedURL(objectName: $objectName)
    }
`;

interface SingleReportProps {
    report: {
        id: string;
        title: string;
        updatedAt: number;
    };
}

function showViewReportButton(src: string | null, matches: boolean = true) {
    if (src && matches) {
        return (
            <Button
                as="a"
                size="lg"
                leftIcon={<ViewIcon />}
                colorScheme="brand"
                borderRadius="2rem"
                href={src}
                target="_blank"
                rel="noreferrer"
            >
                View Report
            </Button>
        );
    }

    return null;
}

export default function SingleReport({ report }: SingleReportProps) {
    const matches = useMediaQuery("(min-width: 80em)");

    const { data, loading, error } = useQuery(REQUEST_PRESIGNED_URL, {
        variables: {
            objectName: report?.title,
        },
        skip: !report?.title,
    });

    if (!report)
        return <DisplayError error={{ message: "Invalid report ID" }} />;

    if (loading) return <Spinner />;

    if (error) return <DisplayError error={error} />;

    const lastUpdated = new Date(report.updatedAt);

    if (data && data.requestPresignedURL === "404") {
        return (
            <VStack flex={"1 0 auto"} w="100%">
                <Alert
                    status="warning"
                    variant="top-accent"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Missing File
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        Looks like we could not find the report. Please contact
                        our support team
                    </AlertDescription>
                </Alert>
            </VStack>
        );
    }

    let src = null;

    if (data && data.requestPresignedURL) {
        src = data.requestPresignedURL;
    }

    const title_without_extension = path.basename(
        report.title,
        path.extname(report.title),
    );

    return (
        <VStack spacing={4} flex={"1 0 auto"}>
            <Heading
                color="secondary"
                textTransform="uppercase"
                as="h3"
                size={{ base: "md", md: "lg" }}
                textAlign="center"
            >
                {title_without_extension}
            </Heading>
            <Text fontSize="xs">
                last updated: {formatRelative(lastUpdated, new Date())}
            </Text>

            {showViewReportButton(src, matches)}
            {src ? <DownloadReport reportTitle={report.title} /> : null}
        </VStack>
    );
}
