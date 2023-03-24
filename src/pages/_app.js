import '@/styles/globals.css';
import {ThirdwebProvider} from '@thirdweb-dev/react';
import {NextUIProvider, useSSR} from '@nextui-org/react';

export default function App({Component, pageProps}) {
    const {isBrowser} = useSSR();
    return (
        isBrowser && (
            <ThirdwebProvider activeChain="mumbai">
                <NextUIProvider>
                    <Component {...pageProps} />
                </NextUIProvider>
            </ThirdwebProvider>
        )
    );
}
