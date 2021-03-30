import React from "react";
import { GoogleLogin } from 'react-google-login';
import { useCookies } from "react-cookie";
import { getUserInfos } from "../utils/Request";
import Head from "next/head";

export default function Home() {

    const [cookies, setCookie] = useCookies(['token']);

    const handleFailure = (response) => {
        console.log(response);
    }

    const handleSuccess = (response) => {
        setCookie('token', response.tokenObj.id_token, { expires: new Date(response.tokenObj.expires_at) });
        const infos = {
            email: response.profileObj.email,
            photo: response.profileObj.imageUrl,
            name: response.profileObj.name,
        }
        getUserInfos(infos, ((err, res) => {
            if (err) console.dir(err);
            else {
                location.href = `/user/${res.uuid}`;
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

                <title>Buy Vite</title>
            </Head>
            <div className="flex p-16 text-center h-screen flex-col justify-center items-center">
                <h1 className="font-bold text-2xl">BuyVite</h1>
                <p>Connectez-vous à votre compte pour créer des liens de ventes de produits</p>
                <GoogleLogin
                    clientId='143259310420-lb0ljkai2d166ofkj269ol6spnon5idg.apps.googleusercontent.com'
                    buttonText="Connectez-vous"
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </React.Fragment>
    )
}