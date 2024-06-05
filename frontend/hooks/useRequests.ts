import { gql, useQuery } from "@apollo/client";

import { Request, User } from "types";

export const ALL_REQUESTS_QUERY = gql`
    query ALL_REQUESTS_QUERY(
        $where: RequestWhereInput!
        $orderBy: [RequestOrderByInput!]!
    ) {
        requests(where: $where, orderBy: $orderBy) {
            id
            type
            description
            status
            updatedAt
        }
    }
`;

interface RequestsResult {
    requests: Array<Request>;
}

export default function useRequests(user: User | undefined) {
    const { data, loading, error } = useQuery<RequestsResult>(
        ALL_REQUESTS_QUERY,
        {
            variables: {
                where: {
                    user: {
                        id: {
                            equals: user?.id,
                        },
                    },
                },
                orderBy: [
                    {
                        updatedAt: "desc",
                    },
                ],
            },
            skip: !user,
        },
    );

    let requests = data && !loading ? data.requests : [];
    if (error) {
        requests = [];
    }

    return { requests };
}
