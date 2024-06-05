import { Heading, Stack } from "@chakra-ui/react";

import { Report } from "types";

import MobileAlert from "./MobileAlert";
import SingleReport from "./SingleReport";

interface ReportsViewProps {
    username: string;
    selectedReport: Report | null;
}

export default function ReportsView({
    username,
    selectedReport,
}: ReportsViewProps) {
    return (
        <Stack spacing={6} flex={"1 0 auto"}>
            <MobileAlert />
            <Heading
                color="secondary"
                textTransform="uppercase"
                size={{ base: "md", md: "lg", lg: "xl" }}
                textAlign="center"
            >
                Welcome, {username}
            </Heading>

            {selectedReport ? <SingleReport report={selectedReport} /> : null}
        </Stack>
    );
}
