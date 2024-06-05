import path from "path";

import { gql, useLazyQuery } from "@apollo/client";
import { DownloadIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
} from "@chakra-ui/react";
import { useEffect } from "react";

import DisplayError from "@/components/ErrorMessage";

const GET_DOWNLOAD_LINK = gql`
    query GET_DOWNLOAD_LINK($objectName: String!) {
        downloadReport(objectName: $objectName)
    }
`;

interface DownloadReportProps {
    reportTitle: string;
}

function checkStatusIsOk(data) {
    if (data && data.downloadReport && data.downloadReport.statusCode === 200) {
        return true;
    }
    return false;
}

function checkStatusIsError(data) {
    if (data && data.downloadReport && data.downloadReport.statusCode === 500) {
        return true;
    }
    return false;
}

export default function DownloadReport({ reportTitle }: DownloadReportProps) {
    const [getDownloadLink, { data, loading, error }] = useLazyQuery(
        GET_DOWNLOAD_LINK,
        {
            fetchPolicy: "no-cache",
        },
    );

    useEffect(() => {
        const isOk = checkStatusIsOk(data);
        if (isOk) {
            const blob = new Blob([atob(data.downloadReport.body)], {
                type: data.downloadReport.headers["Content-Type"],
            });

            //const buffer = new Uint8Array(data.downloadReport.body.data);
            //const blob = new Blob([buffer], {
            //    type: data.downloadReport.headers["Content-Type"],
            //});
            const url = window.URL.createObjectURL(blob);
            const title_without_extension = path.basename(reportTitle);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.target = "_blank";
            link.download = title_without_extension;
            document.body.appendChild(link);
            link.click();
            window.setTimeout(function () {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }, [data]);

    if (error) return <DisplayError error={error} />;

    const isError = checkStatusIsError(data);

    if (isError) {
        return (
            <Alert
                status="warning"
                variant="top-accent"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                w="xs"
            >
                <AlertIcon mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Missing File
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    Looks like we are not able to find the report. Please
                    contact our support team
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Button
            size="lg"
            leftIcon={<DownloadIcon />}
            colorScheme="brand"
            borderRadius="2rem"
            loadingText="Downloading"
            isLoading={loading}
            onClick={() =>
                getDownloadLink({ variables: { objectName: reportTitle } })
            }
            isDisabled={!reportTitle}
        >
            Download Report
        </Button>
    );
}
