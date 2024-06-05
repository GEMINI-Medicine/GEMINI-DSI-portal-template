import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

import { SIGN_OUT_MUTATION } from "@/features/auth";
import { CURRENT_USER_QUERY } from "@/hooks/useUser";

/**
 * @param onIdle - function to notify user when idle timeout is close
 * @param idleTime - number of seconds to wait before user is logged out
 */
export default function useIdleTimeout({ onIdle, idleTime = 300 }) {
    const idleTimeout = 1000 * idleTime;
    const [isIdle, setIdle] = useState<boolean>(false);
    const [remaining, setRemaining] = useState<number>(idleTimeout);
    const [signout] = useMutation(SIGN_OUT_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });

    const handleIdle = () => {
        setIdle(true);
        //console.log("signout");
        signout();
    };

    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        promptBeforeIdle: idleTimeout / 2,
        onPrompt: onIdle,
        onIdle: handleIdle,
        debounce: 500,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(idleTimer.getRemainingTime() / 1000));
        }, 500);

        return () => {
            clearInterval(interval);
        };
    });

    return {
        remaining,
        isIdle,
        setIdle,
        idleTimer,
    };
}
