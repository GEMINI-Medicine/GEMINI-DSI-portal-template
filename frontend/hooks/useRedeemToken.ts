import { gql, useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";

import { CURRENT_USER_QUERY } from "@/hooks/useUser";
import { RedeemInput } from "types";

const REDEEM_TOKEN_MUTATION = gql`
    mutation REDEEM_TOKEN_MUTATION($email: String!, $token: String!) {
        redeemUserMagicAuthToken(email: $email, token: $token) {
            ... on RedeemUserMagicAuthTokenSuccess {
                item {
                    id
                    name
                    email
                }
            }
            ... on RedeemUserMagicAuthTokenFailure {
                code
                message
            }
        }
    }
`;

export default function useRedeemToken({ token, email }: RedeemInput) {
    const inputs: RedeemInput = { email, token };
    const [redeem, { data, loading, error }] = useMutation(
        REDEEM_TOKEN_MUTATION,
        {
            variables: inputs,
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        },
    );

    const redeemToken = useCallback(async () => {
        await redeem();
    }, [redeem]);

    useEffect(() => {
        if (token && email) {
            redeemToken();
        }
    }, [token, email, redeemToken]);

    const successfulError =
        data?.redeemUserMagicAuthToken.__typename ===
        "RedeemUserMagicAuthTokenFailure"
            ? data.redeemUserMagicAuthToken
            : undefined;

    let missingQueryError: { message: string } | undefined = undefined;
    if (!email || !token) {
        missingQueryError = { message: "Missing token and/or email to redeem" };
    }

    const err = error || successfulError || missingQueryError;

    return {
        data,
        err,
        loading,
    };
}
