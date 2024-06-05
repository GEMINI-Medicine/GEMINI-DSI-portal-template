import { Banner, Report, ReportTypes, ReportVersions, Site } from "types";

function getReportsByType(
    selectedHospitalReports: Array<Report>,
    type: ReportTypes,
    version: string | null,
): Array<Report> {
    return selectedHospitalReports.reduce<Array<Report>>((result, report) => {
        const isMatchingReportType = report.tags.find(
            (tag) => tag.name.toLowerCase() === type,
        );
        let isCurrent = false;
        if (isMatchingReportType) {
            if (version) {
                if (report.title.match(version)) {
                    isCurrent = true;
                }
            }

            result.push({ ...report, isCurrent: isCurrent });
        }
        return result;
    }, []);
}

function addIneligibleReports(
    reports: Array<Report>,
    type: ReportTypes,
    versions: ReportVersions,
): Array<Report> {
    const regex = /[Vv](\d+)./;
    if (reports.length === 0) {
        return reports;
    }
    if (!versions) {
        return reports;
    }
    return versions[type].reduce<Array<Report>>((result, version) => {
        const found = reports
            .map((report) => {
                const matches = report.title.match(regex);
                if (matches && matches[1] === version) {
                    return report;
                }
            })
            .filter(Boolean) as Array<Report>;

        if (found.length) {
            result = [...result, ...found];
        } else {
            const cpso = reports[0]?.title.split("-");
            const title =
                type === ReportTypes.IRP
                    ? `IndividualReport v${version} ${reports[0]?.site?.siteID}-${cpso[1]}`
                    : `GroupReport v${version} ${reports[0]?.site?.name}`;
            result.push({
                ...reports[0],
                id: Date.now().toString(),
                isCurrent: false,
                isUnavailable: true,
                title: title,
            });
        }

        return result;
    }, []);
}

export function filterReports(
    reports: Array<Report>,
    versions: ReportVersions,
    selectedHospital: Site,
    banner: Banner,
) {
    if (!selectedHospital) {
        return [
            {
                label: "Individual Report",
                options: [],
            },
            {
                label: "Group Report",
                options: [],
            },
        ];
    }
    const selectedHospitalReports: Array<Report> = reports.filter(
        (report: Report) => report.site?.id === selectedHospital.id,
    );

    const irpReports: Array<Report> = getReportsByType(
        selectedHospitalReports,
        ReportTypes.IRP,
        banner ? banner.individualReportVersion : null,
    );

    const grpReports: Array<Report> = getReportsByType(
        selectedHospitalReports,
        ReportTypes.GRP,
        banner ? banner.groupReportVersion : null,
    );

    const allIRPReports: Array<Report> = addIneligibleReports(
        irpReports,
        ReportTypes.IRP,
        versions,
    );

    const allGRPReports: Array<Report> = addIneligibleReports(
        grpReports,
        ReportTypes.GRP,
        versions,
    );

    const groupedOptions = [
        {
            label: "Individual Report",
            options: allIRPReports,
        },
        {
            label: "Group Report",
            options: allGRPReports,
        },
    ];

    return groupedOptions;
}
