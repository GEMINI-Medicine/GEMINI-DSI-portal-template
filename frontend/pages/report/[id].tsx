import { useQuery } from "@apollo/client";
import { Flex, Progress } from "@chakra-ui/react";
import Error from "next/error";

import DisplayError from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";
import { NotLoggedIn } from "@/features/auth";
import { Policy } from "@/features/policy";
import {
    MobileAlert,
    SINGLE_REPORT_QUERY,
    SingleReport,
} from "@/features/reports";
import { useUser } from "@/hooks/index";
import { User } from "types";

interface SingleReportPageProps {
    query?: { id: string };
    cookies?: string;
}

function showReport(user: User | undefined, report) {
    if (user && user.role) {
        if (user.policyAccepted) {
            return (
                <Flex
                    p={8}
                    justify={"center"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    flex={1}
                >
                    <MobileAlert />
                    <SingleReport report={report} />
                    <Footer />
                </Flex>
            );
        }
        return <Policy />;
    }

    return <NotLoggedIn />;
}

export default function SingleReportPage({
    query,
    cookies,
}: SingleReportPageProps) {
    const { data, loading, error } = useQuery(SINGLE_REPORT_QUERY, {
        variables: {
            id: query?.id,
        },
    });
    const { user } = useUser();

    if (loading) {
        return (
            <Chakra cookies={cookies}>
                <Progress size="md" isIndeterminate color="brand.500" />
            </Chakra>
        );
    }

    if (error) {
        return (
            <Chakra cookies={cookies}>
                <DisplayError error={error} />
            </Chakra>
        );
    }

    const { report } = data;

    if (user && !report) return <Error statusCode={404} />;

    const title = report?.title ? report.title : "";

    return (
        <Chakra cookies={cookies}>
            <Layout title={title}>{showReport(user, report)}</Layout>
        </Chakra>
    );
}
