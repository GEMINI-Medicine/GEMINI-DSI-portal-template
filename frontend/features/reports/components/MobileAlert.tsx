import { Alert, AlertIcon } from "@chakra-ui/react";
import { useMediaQuery } from "usehooks-ts";

export default function MobileAlert() {
    const matches = useMediaQuery("(min-width: 80em)");
    if (!matches) {
        return (
            <Alert status="warning" mb="1em">
                <AlertIcon />
                Experience may not be optimized for Mobile or Tablet
            </Alert>
        );
    }
    return null;
}
