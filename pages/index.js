import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { getUserInfos } from "../utils/Request";
import Head from "next/head";
import jwt_decode from "jwt-decode";

export default function Home() {

    const [cookies, setCookie] = useCookies(['token']);
    const router = useRouter();

    const handleFailure = (response) => {
        console.log("Login Failed:", response);
    }

    const handleSuccess = (credentialResponse) => {
        const token = credentialResponse.credential;
        const profile = jwt_decode(token);
        
        // On définit le cookie avec le token JWT
        const expires = new Date(profile.exp * 1000);
        setCookie('token', token, { expires });

        const infos = {
            email: profile.email,
            photo: profile.picture,
            name: profile.name,
        }
        
        getUserInfos(infos, ((err, res) => {
            if (err) console.dir(err);
            else {
                if (res.uuid) router.push(`/user/${res.uuid}`);
            }
        }));
    }

    return (
        <React.Fragment>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta property="og:title" content="Buy Vite" />
                <meta property="og:site_name" content="Buy Vite" />
                <meta property="og:url" content="https://buyvite.netlify.app" />
                <meta property="og:description" content="Plateforme de vente rapide de produits" />
                <meta property="og:type" content="website" />

                <title>BuyVite</title>
            </Head>
            <div className="flex p-16 text-center h-screen flex-col justify-center items-center">
                <h1 className="font-bold text-2xl">BuyVite</h1>
                <p className="mb-4">Connectez-vous à votre compte pour créer des liens de ventes de produits</p>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleFailure}
                />
            </div>
        </React.Fragment>
    )
}