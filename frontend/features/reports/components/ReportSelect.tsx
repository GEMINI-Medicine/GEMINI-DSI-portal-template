import path from "path";

import { gql, useQuery } from "@apollo/client";
import { Badge, Text, useColorModeValue } from "@chakra-ui/react";
import Select, {
    ActionMeta,
    OptionProps,
    SingleValueProps,
    components,
} from "react-select";

import { Option, Report } from "types";

import { filterReports } from "../lib/filterReports";

const VERSIONS = gql`
    query VERSIONS {
        versions {
            statusCode
            error
            irp
            grp
        }
    }
`;

const SingleValue = ({ children, ...props }: SingleValueProps<Report>) => {
    const isString = typeof children === "string";
    return (
        // @ts-ignore
        <components.SingleValue {...props}>
            {isString ? children.replace(".html", "") : children}
            {showCurrentBadge(props.data.isCurrent)}
        </components.SingleValue>
    );
};

const SingleOption = ({ children, ...props }: OptionProps<Report>) => {
    const isString = typeof children === "string";
    if (props.data.isUnavailable) {
        return (
            // @ts-ignore
            <components.Option {...props}>
                <Text color="gray.400">
                    {isString ? children.replace(".html", "") : children}
                    <Badge ml="1" variant="solid" colorScheme="gray">
                        N/A
                    </Badge>
                </Text>
            </components.Option>
        );
    }
    return (
        // @ts-ignore
        <components.Option {...props}>
            {isString ? children.replace(".html", "") : children}
            {showCurrentBadge(props.data.isCurrent)}
        </components.Option>
    );
};

function showCurrentBadge(isCurrent = false) {
    if (isCurrent) {
        return (
            <Badge ml="1" variant="solid" colorScheme="red">
                Current
            </Badge>
        );
    }

    return null;
}

export function ReportSelect({
    selectReportRef,
    disabled,
    reportsData,
    loading,
    selectedHospital,
    banner,
    setSelectedReport,
}) {
    const { data: versionsData, loading: versionsLoading } = useQuery(VERSIONS);
    const bg = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("black", "#CBD5E0");

    if (!selectedHospital) {
        return null;
    }

    const filteredReports = filterReports(
        reportsData,
        versionsData?.versions,
        selectedHospital,
        banner,
    );

    const numberOfAvailableReports =
        filteredReports[0].options.filter(
            (report) => report.isUnavailable !== true,
        ).length +
        filteredReports[1].options.map(
            (report) => !report.isUnavailable !== true,
        ).length;

    const placeholder = selectedHospital
        ? `${numberOfAvailableReports} ${
              numberOfAvailableReports ? "report" : "reports"
          } available`
        : "Please select a hospital first";

    if (disabled) {
        return null;
    }

    return (
        <Select
            ref={selectReportRef}
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: "2rem",
                    textAlign: "left",
                    backgroundColor: bg,
                }),
                option: (styles, { isDisabled, isFocused, isSelected }) => {
                    return {
                        ...styles,
                        color: "rgba(0, 0, 0, 0.80)",
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isDisabled
                            ? undefined
                            : isSelected
                              ? "#bee3f8"
                              : isFocused
                                ? "rgba(0, 0, 0, 0.06)"
                                : undefined,
                        cursor: isDisabled ? "not-allowed" : "default",
                    };
                },
                singleValue: (styles) => ({
                    ...styles,
                    color: textColor,
                }),
            }}
            // @ts-ignore
            components={{ SingleValue, Option: SingleOption }}
            name="reports"
            placeholder={placeholder}
            isSearchable
            isClearable
            isDisabled={reportsData.length === 0 || disabled}
            isOptionDisabled={(option: Report) => option.isUnavailable === true}
            options={filteredReports}
            isLoading={loading || versionsLoading}
            getOptionLabel={(option: Report) =>
                path.basename(option.title, path.extname(option.title))
            }
            getOptionValue={(option: Report) => option.id}
            onChange={(
                option: Report | null,
                actionMeta: ActionMeta<Option>,
            ) => {
                if (option) {
                    setSelectedReport(option);
                }
                if (actionMeta.action === "clear") {
                    setSelectedReport(null);
                }
            }}
        />
    );
}
