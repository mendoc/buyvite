import { useState } from "react";
import { GoogleLogin } from 'react-google-login';
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export default function Home() {

    const [user, setUser] = useState({});
    const [cookies, setCookie] = useCookies(['token']);
    const router = useRouter();

    const responseGoogle = (response) => {
        console.log(response);
    }

    const handleSuccess = (response) => {
        console.log(response);
        setCookie('token', response.tokenObj.id_token, { expires: new Date(response.tokenObj.expires_at) });
        router.push('/user');
    }

    return (
        <div className="flex p-16 text-center h-screen flex-col justify-center items-center">
            <h1 className="font-bold text-2xl">BuyVite</h1>
            <p>Connectez-vous à votre compte pour créer des liens de ventes de produits</p>
            <GoogleLogin
                clientId='143259310420-lb0ljkai2d166ofkj269ol6spnon5idg.apps.googleusercontent.com'
                buttonText="Login"
                onSuccess={handleSuccess}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}