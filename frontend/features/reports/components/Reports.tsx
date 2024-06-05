import { gql, useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import DisplayError from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import { Report } from "types";

import EmptyReports from "./EmptyReports";
import ReportsSelection from "./ReportsSelection";
import ReportsView from "./ReportsView";

export const ALL_REPORTS_QUERY = gql`
    query ALL_REPORTS_QUERY {
        reports(
            where: { status: { equals: "PUBLISHED", mode: insensitive } }
            orderBy: { updatedAt: desc }
        ) {
            id
            title
            updatedAt
            site {
                name
                id
                siteID
            }
            tags {
                name
            }
        }
    }
`;

interface ReportsProps {
    username: string;
}

export default function Reports({ username }: ReportsProps) {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const { data, error, loading } = useQuery(ALL_REPORTS_QUERY);

    const reportsData: Report[] | [] = data ? data.reports : [];

    if (error) {
        return <DisplayError error={error} />;
    }

    if (reportsData.length === 0 && !loading) {
        return <EmptyReports />;
    }

    return (
        <>
            <Flex
                pt={{ base: 4, md: 8 }}
                pb={{ base: 4, md: 8 }}
                flex={1}
                bg="primary"
                alignItems={{ base: "center", md: "center" }}
            >
                <ReportsSelection
                    reportsData={reportsData}
                    loading={loading}
                    setSelectedReport={setSelectedReport}
                />
            </Flex>
            <Flex
                p={{ base: 4, md: 8 }}
                flex={1}
                justify={"center"}
                flexDirection={"column"}
                alignItems={"center"}
            >
                <ReportsView
                    username={username}
                    selectedReport={selectedReport}
                />
                <Footer />
            </Flex>
        </>
    );
}
