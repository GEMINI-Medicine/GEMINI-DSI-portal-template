import { gql, useQuery } from "@apollo/client";

import { User } from "types";

const CURRENT_USER_QUERY = gql`
    query {
        authenticatedItem {
            ... on User {
                id
                email
                name
                cpso
                policyAccepted
                role {
                    id
                    name
                }
                sites {
                    id
                    name
                    siteID
                }
            }
        }
    }
`;

export default function useUser() {
    const { data, loading } = useQuery<{ authenticatedItem: User }>(
        CURRENT_USER_QUERY,
    );

    const user = data?.authenticatedItem;

    return { user, loading };
}

export { CURRENT_USER_QUERY };
