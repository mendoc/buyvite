import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from '../../utils/DB'
import ShareButton from '../../components/ShareButton';
import Image from 'next/image';

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
        <main className="md:px-10 px-3">
            <div className="flex justify-between items-center my-3">
                <span><Link href="/">BuyVite</Link></span>
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
                <div className="md:flex flex-wrap justify-start my-5">
                    {products && products.map((prod) => {
                        const lien = `https://buyvite.netlify.app/product/${prod.reference}`;
                        const price = parseInt(prod.price).toLocaleString('fr-FR');
                        return (
                            <div key={prod.reference} className="md:flex flex-col border self-start p-2 md:mr-3 mt-3 rounded max-w-sm">
                                <span className="mt-3 mb-2 font-bold text-md">{prod.name}</span>
                                <Image className="rounded" src={prod.image} alt="Picture of the author" width={500} height={192} objectFit="cover" />
                                <div className="flex flex-col justify-start items-start mt-2">
                                    <span className="font-bold">{price} F CFA</span>
                                    <ShareButton lien={lien} />
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
    const uuid = params.uuid;
    let products = [];

    const collection = db.collection('products');
    const snapshot = await collection.where('user', '==', uuid).get();
    if (!snapshot.empty) {
        snapshot.forEach(doc => {
            products.push(doc.data());
        });
    }

    return {
        props: { products }
    }

}
