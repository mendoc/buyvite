import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from '../../utils/DB'

export default function User({ products }) {
    const [user, setUser] = useState({});
    const [cookies, setCookie] = useCookies(['token']);
    const router = useRouter();

    useEffect(() => {
        if (!cookies.token) {
            router.push('/')
        } else {
            const infos = jwt_decode(cookies.token);
            setUser(infos);
        }
    }, [])

    if (!cookies.token) return null;

    return (
        <div className="px-10">
            <div className="flex justify-between items-center my-3">
                <span>BuyVite</span>
                <div className="flex items-center">
                    <img className="w-10 rounded-full mr-3" src={user.picture} />
                    <span>{user.name}</span>
                </div>
            </div>
            <hr />
            <div className="mt-5">
                <div className="flex justify-between items-center">
                    <h2>Vos produits</h2>
                    <Link href="/create">
                        <button className="py-1 px-2 rounded text-white bg-blue-900">Créer un lien</button>
                    </Link>
                </div>
                <div className="flex flex-wrap justify-center my-5">
                    {products.length > 0 && products.map((prod) => {
                        return (
                            <div key={prod._id} className="flex border p-2 mr-3 mt-3 rounded max-w-sm">
                                <img className="h-20 mr-3" src={prod.image} />
                                <div className="flex flex-col justify-between items-center">
                                    <span>{prod.name}</span>
                                    <span className="text-xs break-all text-center text-gray-800"><a href={`/produit/${prod._id}`} target="_blank">https://buyvite.netlify.app/produit/{prod._id}</a></span>
                                    <span className=" flex items-center text-xs cursor-pointer self-center py-1 px-2 rounded text-white bg-blue-900">
                                        <svg className="h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                        </svg>
                                        Copier le lien de vente
                                    </span>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ params }) {

    const dbName = process.env.DB_NAME;
    const uuid = params.uuid;

    const getProducts = new Promise((resolve, reject) => {
        client.connect(err => {
            if (!err) {
                const db = client.db(dbName);
                const collection = db.collection("products");

                collection.find({ user: uuid }).toArray((err, data) => {
                    client.close();
                    resolve(data);
                });
            } else {
                reject(err);
            }
        });
    });

    let products = [];

    const productsObj = await getProducts;
    console.log(productsObj);
    if (productsObj) {
        products = productsObj.map(({ _id, name, user, image }) => {
            return { _id: `${_id}`, name, user, image };
        })
    }

    return {
        props: { products }
    }
}