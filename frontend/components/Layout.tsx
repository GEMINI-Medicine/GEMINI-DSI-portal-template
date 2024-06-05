import { Grid, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode, useState } from "react";

import Header from "@/components/Header";
import SessionTimeout from "@/components/SessionTimeout";
import { useIdleTimeout, useUser } from "@/hooks/index";

type LayoutProps = {
    children: ReactNode;
    title?: string;
};

export default function Layout({ children, title }: LayoutProps) {
    const { user } = useUser();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleIdle = () => {
        setOpenModal(true);
    };
    const { remaining, idleTimer } = useIdleTimeout({ onIdle: handleIdle });

    const stay = () => {
        setOpenModal(false);
        idleTimer.reset();
    };

    const headTitle = "Portal | " + title;

    return (
        <Grid
            gridTemplateRows={{ base: "1fr", sm: "1fr auto" }}
            alignItems={"center"}
        >
            <Head>
                <title>{headTitle}</title>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <Header />

            <Stack
                direction={{ base: "column", md: "row" }}
                as="main"
                sx={{ height: "calc(100vh - 7em)" }}
            >
                {children}
            </Stack>
            {user ? (
                <SessionTimeout
                    openModal={openModal}
                    remaining={remaining}
                    handleStillHere={stay}
                />
            ) : null}
        </Grid>
    );
}
