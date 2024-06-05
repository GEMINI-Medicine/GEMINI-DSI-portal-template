import { gql, useQuery } from "@apollo/client";
import { Container, Heading, Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { SelectInstance } from "react-select";

import { Option, Report, Site } from "types";

import ReportsBanner from "./ReportsBanner";
import EmptyReports from "./EmptyReports";
import { ReportSelect } from "./ReportSelect";
import { SiteSelect } from "./SiteSelect";

const BANNER_QUERY = gql`
    query BANNER_QUERY {
        banner(where: { id: 1 }) {
            date
            individualReportVersion
            groupReportVersion
        }
    }
`;

interface ReportsSelectionProps {
    reportsData: Report[] | [];
    loading: boolean;
    setSelectedReport: Dispatch<SetStateAction<Report | null>>;
}

export default function ReportsSelection({
    reportsData,
    loading,
    setSelectedReport,
}: ReportsSelectionProps) {
    const { data: bannerData, loading: bannerLoading } = useQuery(BANNER_QUERY);
    const selectReportRef = useRef<SelectInstance<Option> | null>(null);
    const [disabled, setDisabled] = useState(true);
    const [selectedHospital, setSelectedHospital] = useState<Site | null>(null);

    const sites: Array<Site> = [
        ...new Set<Site>(reportsData.map((data: { site: Site }) => data.site)),
    ].filter((n) => n);

    const banner =
        !bannerLoading && bannerData.banner ? bannerData.banner : null;

    if (sites.length === 0 && !loading) {
        return <EmptyReports />;
    }

    if (sites.length === 1 && !selectedHospital) {
        setSelectedHospital(sites[0]);
        setDisabled(false);
    }

    return (
        <Container>
            <Stack spacing={8}>
                <ReportsBanner banner={banner} />
                {sites.length > 1 ? (
                    <SiteSelect
                        sites={sites}
                        loading={loading}
                        selectReportRef={selectReportRef}
                        setDisabled={setDisabled}
                        setSelectedHospital={setSelectedHospital}
                    />
                ) : (
                    <Heading color="white">{sites[0]?.name}</Heading>
                )}
                <ReportSelect
                    reportsData={reportsData}
                    banner={banner}
                    disabled={disabled}
                    loading={loading}
                    selectReportRef={selectReportRef}
                    selectedHospital={selectedHospital}
                    setSelectedReport={setSelectedReport}
                />
            </Stack>
        </Container>
    );
}
