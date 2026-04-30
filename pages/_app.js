import { CookiesProvider } from 'react-cookie';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '../styles/globals.css';

export default function Application({ Component, pageProps }) {
    return (
        <GoogleOAuthProvider clientId="143259310420-lb0ljkai2d166ofkj269ol6spnon5idg.apps.googleusercontent.com">
            <CookiesProvider>
                <Component {...pageProps} />
            </CookiesProvider>
        </GoogleOAuthProvider>
    )
}