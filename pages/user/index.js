import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function User() {
    const [cookies, setCookie] = useCookies(['token']);
    const router = useRouter();

    useEffect(() => {
        if (!cookies.token) {
            router.push('/')
        }
    })

    if (!cookies.token) return null;

    const userinfos = jwt_decode(cookies.token);

    return (
        <div className="px-10">
            <div className="flex justify-between items-center my-3">
                <span>BuyVite</span>
                <div className="flex items-center">
                    <img className="w-10 rounded-full mr-3" src={userinfos.picture} />
                    <span>{userinfos.name}</span>
                </div>
            </div>
            <hr />
            <div className="mt-5">
                <div className="flex justify-between items-center">
                    <h2>Vos produits</h2>
                    <button className="py-1 px-2 rounded text-white bg-blue-900">Créer un lien</button>
                </div>
                <div className="flex mt-5">
                    <div className="flex border p-2 rounded">
                        <img className="h-20 mr-3" src="assets/img/cover-rich-dad.jpg" />
                        <div className="flex flex-col justify-between items-center">
                            <span>Père riche, père pauvre</span>
                            <span className="text-xs text-gray-800">https://buyvite.netlify.app</span>
                            <span className=" flex items-center text-xs cursor-pointer self-center py-1 px-2 rounded text-white bg-blue-900">
                                <svg className="h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                </svg>
                                Copier le lien de vente
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}