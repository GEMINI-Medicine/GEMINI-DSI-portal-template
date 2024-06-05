import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import Select, { ActionMeta } from "react-select";

import { Site } from "types";

type Option = unknown;

interface SiteSelectProps {
    options: Site[] | undefined;
    isLoading: boolean;
    isDisabled?: boolean;
    value: Site[] | [] | undefined;
    handleChange: (e: any) => void;
}

export default function SiteMultiSelect({
    options,
    isLoading,
    isDisabled,
    value,
    handleChange,
}: SiteSelectProps) {
    const { colorMode } = useColorMode();
    const bg = useColorModeValue("white", "#1A202C");
    const color = useColorModeValue("#02AFF0", "#00141f");
    return (
        <Select
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: "2rem",
                    textAlign: "left",
                    backgroundColor:
                        colorMode === "light" ? "white" : "#1A202C",
                    borderColor:
                        colorMode === "light"
                            ? "inherit"
                            : "rgba(255, 255, 255, 0.16)",
                }),
                option: (styles, { isDisabled, isFocused, isSelected }) => {
                    return {
                        ...styles,
                        backgroundColor: isDisabled
                            ? undefined
                            : isSelected
                              ? color
                              : isFocused
                                ? color
                                : bg,
                        cursor: isDisabled ? "not-allowed" : "default",
                        ":active": {
                            ...styles[":active"],
                            backgroundColor: !isDisabled
                                ? isSelected
                                    ? color
                                    : color
                                : undefined,
                        },
                    };
                },
                input: (styles) => {
                    return {
                        ...styles,
                        color: colorMode === "light" ? "#1A202C" : "white",
                    };
                },
                placeholder: (styles) => ({
                    ...styles,
                    color: colorMode === "light" ? "#1A202C" : "white",
                }),
                multiValue: (styles) => {
                    return {
                        ...styles,
                    };
                },
            }}
            name="sites"
            placeholder="Hospital(s)"
            isMulti
            isSearchable
            options={options || []}
            isLoading={isLoading}
            isDisabled={isDisabled}
            getOptionLabel={(option: Site) => option.name}
            getOptionValue={(option: Site) => option.id}
            onChange={(
                option: readonly Option[],
                actionMeta: ActionMeta<Option>,
            ) => {
                const param = {
                    target: {
                        name: actionMeta.name,
                        type: actionMeta.action,
                        value: option,
                    },
                };
                handleChange(param);
            }}
            value={value}
        />
    );
}
