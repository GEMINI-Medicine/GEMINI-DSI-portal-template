import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Link,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";

import { NextChakraLink } from "@/components/NextChakraLink";
import { Banner } from "types";

interface BannerProps {
    banner: Banner;
}

export default function ReportsBanner({ banner }: BannerProps) {
    const textColor = useColorModeValue("#2b6cb0", "#02AFF0");
    if (banner) {
        return (
            <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
            >
                <AlertIcon boxSize={{ base: "20px", md: "40px" }} mr={0} />
                <AlertTitle mt={4} mb={1} fontSize={{ base: "sm", md: "lg" }}>
                    As of {format(new Date(banner.date), "d MMM y")}, the most
                    current version of the reports are:
                </AlertTitle>
                <AlertDescription
                    maxWidth="sm"
                    fontSize={{ base: "xs", md: "sm" }}
                >
                    <Text>
                        - {banner.individualReportVersion} for individual level reports
                    </Text>
                    <Text>
                        - {banner.groupReportVersion} for group level reports
                    </Text>
                    <Text mt={2}>
                        Please refer to the{" "}
                        <NextChakraLink
                            href="/faq"
                            color={textColor}
                            _hover={{ textDecoration: "underline" }}
                        >
                            FAQ
                        </NextChakraLink>{" "}
                        page for more details.
                    </Text>
                </AlertDescription>
            </Alert>
        );
    }
    return null;
}
