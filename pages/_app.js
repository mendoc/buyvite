import { CookiesProvider } from 'react-cookie';
import '../styles/globals.css';

export default function Application({ Component, pageProps }) {
    return (
        <CookiesProvider>
            <Component {...pageProps} />
        </CookiesProvider>
    )
}