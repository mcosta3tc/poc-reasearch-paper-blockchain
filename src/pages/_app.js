import '@/styles/globals.css';
import {ThirdwebProvider} from '@thirdweb-dev/react';
import {NextUIProvider} from '@nextui-org/react';

export default function App({Component, pageProps}) {
    return (
        <NextUIProvider>
            <ThirdwebProvider activeChain="mumbai">
                <Component {...pageProps} />
            </ThirdwebProvider>
        </NextUIProvider>
    );
}
