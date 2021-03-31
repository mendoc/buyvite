import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from '../../utils/DB'
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function User({ products }) {
    const [user, setUser] = useState({});
    const [cookies] = useCookies(['token']);
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
        <main className="px-10">
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
                    <h2>Vos produits ({products.length})</h2>
                    <Link href="/create">
                        <button className="py-1 px-2 rounded text-white bg-blue-900">Créer un lien</button>
                    </Link>
                </div>
                <div className="flex flex-wrap justify-center my-5">
                    {products && products.map((prod) => {
                        const lien = `https://buyvite.netlify.app/product/${prod.reference}`;
                        return (
                            <div key={prod._id} className="flex border p-2 mr-3 mt-3 rounded max-w-sm">
                                <img className="h-20 mr-3" src={prod.image} />
                                <div className="flex flex-col justify-between items-center">
                                    <span>{prod.name}</span>
                                    <span className="text-xs break-all text-center text-gray-800"><a href={`${lien}`} target="_blank">{lien}</a></span>
                                    <CopyToClipboard text={lien} onCopy={() => 'Lien copié'}>
                                        <span className=" flex items-center text-xs cursor-pointer self-center py-1 px-2 rounded text-white bg-blue-900">
                                            <svg className="h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                            </svg>
                                        Copier le lien de vente
                                    </span>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </main>
    )
}

export async function getServerSideProps({ params }) {
    const dbName = process.env.DB_NAME;
    const uuid = params.uuid;
    let products = [];

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('products');
        const cursor = collection.find({ user: uuid }, { user: 1, _id: 0 });
        for await (let doc of cursor) {
            console.log(doc);
            doc._id = `${doc._id}`;
            products.push({ ...doc });
        }
    } catch (err) {
        console.log(err);
        await client.close();
    }

    return {
        props: { products }
    }

}
