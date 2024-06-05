import type { AppProps } from "next/app";

import { ApolloWrapper } from "@/context/apolloWrapper";
//import GoogleAnalytics from "@/components/GoogleAnalytics";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloWrapper>
            {/* <GoogleAnalytics /> */}
            <Component {...pageProps} />
        </ApolloWrapper>
    );
}

type pageProps = {
    query?: any;
};

MyApp.getInitialProps = async function ({ Component, ctx }) {
    let pageProps: pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;

    return { pageProps };
};

export default MyApp;
