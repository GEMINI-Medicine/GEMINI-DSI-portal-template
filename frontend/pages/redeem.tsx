import { useLazyQuery } from "@apollo/client";
import { Progress } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import DisplayError from "@/components/ErrorMessage";
import Layout from "@/components/Layout";
import { Chakra } from "@/context/Chakra";
import { CURRENT_USER_QUERY, useRedeemToken } from "@/hooks/index";
import { RedeemInput } from "types";

type RedeemProps = {
    query: RedeemInput;
    cookies?: string;
};

export default function Redeem({ query, cookies }: RedeemProps) {
    const [getUser, { data: user, loading: userLoading }] =
        useLazyQuery(CURRENT_USER_QUERY);
    const { data, err, loading } = useRedeemToken(query);
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (data && !loading) {
            getUser();
        }
    }, [data, loading, getUser]);

    useEffect(() => {
        // redirect to home if already logged in
        if (user && user.authenticatedItem && !userLoading) {
            router.push("/");
        }
    }, [user, router, userLoading]);

    if (err) {
        return (
            <Chakra cookies={cookies}>
                <Layout title="Dashboard">
                    <DisplayError error={err} />
                </Layout>
            </Chakra>
        );
    }

    if (data && user && !user.authenticatedItem) {
        return (
            <Chakra cookies={cookies}>
                <Layout title="Dashboard">
                    <DisplayError
                        error={{
                            message:
                                "You have not been assigned a user access type yet. Please contact our support team",
                        }}
                    />
                </Layout>
            </Chakra>
        );
    }

    return (
        <Chakra cookies={cookies}>
            <Progress size="md" isIndeterminate color="brand.500" />
        </Chakra>
    );
}
