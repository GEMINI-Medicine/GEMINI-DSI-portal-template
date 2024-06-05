import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";
import { differenceInHours, parseISO } from "date-fns";

export default function RequestStatus({ status, updatedAt }) {
    const isOutstanding = status === "OUTSTANDING";
    const isApproved = status === "APPROVED";
    const isDeclined = status === "DECLINED";
    const diff = differenceInHours(Date.now(), parseISO(updatedAt));

    if (isOutstanding) {
        return (
            <Alert status="warning" variant="left-accent">
                <AlertIcon />
                <AlertTitle>Profile update requested!</AlertTitle>
                <AlertDescription>
                    Our support team will see your request and approve or decline
                    your request
                </AlertDescription>
            </Alert>
        );
    }

    if (isApproved && diff < 24) {
        return (
            <Alert status="success" variant="left-accent">
                <AlertIcon />
                <AlertTitle>Profile updated!</AlertTitle>
                <AlertDescription>
                    Your request was processed and approved and your profile
                    updated accordingly
                </AlertDescription>
            </Alert>
        );
    }

    if (isDeclined && diff < 24) {
        return (
            <Alert status="error" variant="left-accent">
                <AlertIcon />
                <AlertTitle>Profile update declined!</AlertTitle>
                <AlertDescription>
                    Your request was processed and declined
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}
