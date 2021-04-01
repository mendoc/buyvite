import React, { useState } from "react";
import { payProduct } from '../../utils/Request';
import { db } from '../../utils/DB';
import fs from '../../utils/firestore';
import Head from "next/head";

export default function Product({ product }) {

    if (!product) return <h1>Produit Introuvable</h1>;

    const [processing, setProcessing] = useState(false);
    const [state, setState] = useState('');
    const [numero, setNumero] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!numero || !product.reference) return;

        setMessage('');
        setProcessing(true);
        payProduct(numero, product.reference, (err, res) => {
            if (err) {
                setProcessing(false);
                setMessage(err.message);
            } else {
                setMessage('');
                if (res.payment) {
                    fs.collection('payments').doc(res.payment).onSnapshot(snap => {
                        setProcessing(false);
                        setState(snap.get('state'));
                    }, err => {
                        console.log(`Encountered error:`, err);
                    })
                } else {
                    setProcessing(false);
                }
            }
        });
    }

    const handleChange = (e) => {
        setMessage('');
        setNumero(e.target.value);
    }

    const price = parseInt(product.price).toLocaleString('fr-FR');

    let bloc = null;
    let theme = null;

    switch (state) {
        case 'init':
            bloc = (
                <div className="border-t pt-4">
                    <h2 className="font-bold text-orange-600 mb-2">Paiement initié</h2>
                    <p>Veuillez consulter votre téléphone pour renseigner votre mot de passe.</p>
                </div>
            );
            theme = "#dd6b20";
            break;
        case 'cancel':
            bloc = (
                <div className="border-t pt-4">
                    <h2 className="font-bold text-red-600 mb-2">Paiement annulé</h2>
                    <p>Apparemment vous n'avez pas pu finaliser le paiement. </p>
                    <button onClick={handleSubmit} className="rounded py-3 text-lg font-bold mt-4 text-white w-full bg-gray-500">Réessayer</button>
                </div>
            );
            theme = "#e53e3e";
            break;
        case 'paid':
            bloc = (
                <div className="border-t pt-4">
                    <h2 className="font-bold text-green-600 mb-2">Paiement effectué</h2>
                    <p>Votre paiement a été reçu. Veuillez contacter le vendeur pour recevoir votre dû:</p>
                </div>
            );
            theme = "#48bb78";
            break;
        default:
            bloc = (
                <form className="border-t pt-4" onSubmit={handleSubmit}>
                    <h2 className="font-bold mb-2">Payer via Airtel Money</h2>
                    <label htmlFor="numero">Votre numéro</label>
                    <input className="w-full border outline-none py-2 px-1" type="tel" value={numero} onChange={handleChange} name="number"
                        placeholder="ex: 074123456" required spellCheck={false} autoComplete="off" />
                    {message && <p className="mt-2 text-red-700 bg-red-200 rounded px-2 py-1 font-bold italic">{message}</p>}
                    <input className="rounded py-3 text-lg font-bold mt-4 text-white w-full bg-blue-500" type="submit" value="Acheter" />
                </form>
            );
            theme = "#4299e1";
            break;
    }

    return (
        <React.Fragment>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta property="og:title" content={product.name} />
                <meta property="og:site_name" content="BuyVite" />
                <meta property="og:url" content={`https://buyvite.netlify.app/product/${product.reference}`} />
                <meta property="og:description" content={`${price} F CFA | Cliquez ici pour acheter le produit.`} />
                <meta property="og:image" content={product.image} />
                <meta property="og:type" content="article" />

                <meta name="theme-color" content={theme} />

                <title>{product.name} | {price} F CFA</title>
            </Head>
            <div className={`${processing ? 'processing' : ''}`}>
                <div
                    className="loading hidden flex px-5 text-center text-white flex-col justify-center fixed inset-0 z-50 bg-black bg-opacity-75">
                    <img className="w-16 self-center" src="/assets/img/load.gif" alt="Image de chargement" />
                    <span>Traitement en cours <br /> Veuillez patienter s'il vous plaît</span>
                </div>
                <div className="md:flex md:max-w-screen-md md:mt-5 md:m-auto" id="content">
                    <header className="bg-gray-200 py-4 md:w-1/2">
                        <img className="h-64 md:h-auto md:w-full m-auto rounded"
                            src={product.image}
                            alt="Image du produit" />
                    </header>
                    <main className="p-5 pt-2 md:w-1/2">
                        <span className="inline-block pt-2 pb-1 px-2 text-lg font-bold bg-gray-400 rounded my-2">{parseInt(product.price).toLocaleString('fr-FR')} F CFA</span>
                        <h1 className="font-bold text-2xl">{product.name}</h1>
                        <p className="my-3">{product.description}</p>
                        {bloc}
                    </main>
                </div>
            </div>
        </React.Fragment>
    )
}

export async function getServerSideProps({ params }) {
    const reference = params.reference;
    let product = {};

    const collection = db.collection('products');
    const snapshot = await collection.where('reference', '==', reference).limit(1).get();

    if (!snapshot.empty) {
        snapshot.forEach(doc => {
            product = doc.data();
        })
    }

    return {
        props: { product }
    }

}
