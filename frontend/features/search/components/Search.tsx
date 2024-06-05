import path from "path";

import { gql, useLazyQuery } from "@apollo/client";
import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    List,
    ListItem,
    Spinner,
    useColorModeValue,
} from "@chakra-ui/react";
import { useCombobox } from "downshift";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";

import { Report } from "types";

const SEARCH_REPORTS_QUERY = gql`
    query SEARCH_REPORTS_QUERY($searchTerm: String!) {
        searchTerms: reports(
            where: {
                AND: [{ status: { equals: "published", mode: insensitive } }]
                OR: [
                    { title: { contains: $searchTerm, mode: insensitive } }
                    {
                        tags: {
                            some: {
                                name: {
                                    contains: $searchTerm
                                    mode: insensitive
                                }
                            }
                        }
                    }
                    {
                        site: {
                            name: { contains: $searchTerm, mode: insensitive }
                        }
                    }
                ]
            }
        ) {
            id
            title
            tags {
                name
            }
        }
    }
`;

export default function Search() {
    const listBG = useColorModeValue("white", "gray.800");
    const bg = useColorModeValue("accent.500", "brand.500");
    const router = useRouter();
    const [findItems, { loading, data }] = useLazyQuery(SEARCH_REPORTS_QUERY, {
        fetchPolicy: "no-cache",
    });
    const items: Array<Report> = data?.searchTerms || [];
    const debounceFindItems = debounce(findItems, 350);
    //resetIdCounter();
    const {
        isOpen,
        inputValue,
        getMenuProps,
        getInputProps,
        getItemProps,
        highlightedIndex,
    } = useCombobox({
        items,
        onInputValueChange() {
            debounceFindItems({
                variables: {
                    searchTerm: inputValue,
                },
            });
        },
        onSelectedItemChange({ selectedItem }) {
            if (selectedItem) {
                router.push({
                    pathname: `/report/${selectedItem.id}`,
                });
            }
        },
        itemToString: (item) => {
            return item ? item.title : "";
        },
    });
    return (
        <Box pos={"relative"}>
            <InputGroup>
                <InputLeftElement
                    children={
                        loading ? (
                            <Spinner
                                thickness="4px"
                                speed="1s"
                                emptyColor="gray.200"
                                color="brand.500"
                            />
                        ) : (
                            <SearchIcon />
                        )
                    }
                />
                <Input
                    {...getInputProps({
                        type: "search",
                        placeholder: "Search Reports by title or site",
                        id: "search",
                        className: loading ? "loading" : "",
                    })}
                    border={0}
                />
            </InputGroup>
            <List
                {...getMenuProps()}
                zIndex={2}
                flex={1}
                position={"absolute"}
                bg={listBG}
                w={"100%"}
                border={isOpen ? "1px" : 0}
                borderColor={"gray.300"}
                borderRadius={2}
            >
                {isOpen &&
                    items.map((item, index) => (
                        <ListItem
                            {...getItemProps({ item, index })}
                            key={item.id}
                            bg={index === highlightedIndex ? bg : "inherit"}
                            color={
                                index === highlightedIndex ? "white" : "inherit"
                            }
                            px={4}
                            py={2}
                            cursor="pointer"
                        >
                            {path.basename(
                                item.title,
                                path.extname(item.title),
                            )}
                        </ListItem>
                    ))}
                {isOpen && !items.length && !loading && (
                    <ListItem px={4} py={2}>
                        Sorry, No items found for {inputValue}
                    </ListItem>
                )}
            </List>
        </Box>
    );
}
