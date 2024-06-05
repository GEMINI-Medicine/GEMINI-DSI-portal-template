import { useColorModeValue } from "@chakra-ui/react";
import Select from "react-select";

import { Site } from "types";

export function SiteSelect({
    sites,
    loading,
    setSelectedHospital,
    setDisabled,
    selectReportRef,
}) {
    const bg = useColorModeValue("white", "#1A202C");
    const textColor = useColorModeValue("black", "#CBD5E0");
    return (
        <Select
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
                        cursor: isDisabled ? "not-allowed" : "default",
                        backgroundColor: isDisabled
                            ? undefined
                            : isSelected
                              ? "#bee3f8"
                              : isFocused
                                ? "rgba(0, 0, 0, 0.06)"
                                : undefined,
                    };
                },
                singleValue: (styles) => ({
                    ...styles,
                    color: textColor,
                }),
            }}
            name="sites"
            placeholder="Select a Hospital"
            isSearchable
            isClearable
            options={sites || []}
            isLoading={loading}
            getOptionLabel={(option: Site) => option.name}
            getOptionValue={(option: Site) => option.id}
            onChange={(option: Site | null) => {
                setSelectedHospital(option);
                selectReportRef.current?.clearValue();
                if (option) {
                    setDisabled(false);
                } else {
                    setDisabled(true);
                }
            }}
        />
    );
}
