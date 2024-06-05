import { gql, useMutation } from "@apollo/client";

import { CURRENT_USER_QUERY } from "@/hooks/index";

const SIGN_OUT_MUTATION = gql`
    mutation {
        endSession
    }
`;

export default function Logout() {
    const [logout] = useMutation(SIGN_OUT_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });

    function handleLogout() {
        logout();
    }
    return <a onClick={handleLogout}>Log Out</a>;
}

export { SIGN_OUT_MUTATION };
