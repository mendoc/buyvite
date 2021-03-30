import React, { useState } from "react";
import { payProduct } from '../../utils/Request';
import { client } from '../../utils/DB';
import Head from "next/head";

export default function Product({ product }) {

    const [processing, setProcessing] = useState(false);
    const [numero, setNumero] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        payProduct(numero, product.reference, (err, res) => {
            setProcessing(false);
            if (err) console.dir(err);
            else console.log(res);
        });
    }

    const handleChange = (e) => {
        setNumero(e.target.value);
    }

    const price = parseInt(product.price).toLocaleString('fr-FR');

    return (
        <React.Fragment>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta property="og:title" content={product.name} />
                <meta property="og:site_name" content="BuyVite" />
                <meta property="og:url" content={`https://buyvite.netlify.app/product/${product.reference}`} />
                <meta property="og:description" content={`Acheter le produit ${product.name} sur BuyVite à ${price} F CFA`} />
                <meta property="og:image" content={product.image} />
                <meta property="og:type" content="article" />

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
                    <main className="p-5 md:w-1/2">
                        <span className="inline-block pt-2 pb-1 px-2 text-lg font-bold bg-gray-400 rounded my-4">{parseInt(product.price).toLocaleString('fr-FR')} F CFA</span>
                        <h1 className="font-bold text-2xl">{product.name}</h1>
                        <p className="my-5">{product.description}</p>
                        <form className="border-t pt-4" onSubmit={handleSubmit}>
                            <h2 className="font-bold mb-2">Payer via Airtel Money</h2>
                            <label htmlFor="numero">Votre numéro</label>
                            <input className="w-full border outline-none py-2 px-1" type="tel" value={numero} onChange={handleChange} name="numero"
                                placeholder="ex: 074123456" required spellCheck={false} />
                            <input className="rounded py-3 text-lg font-bold mt-4 text-white w-full bg-green-500" type="submit" value="Acheter" />
                        </form>
                    </main>
                </div>
            </div>
        </React.Fragment>
    )
}

export async function getServerSideProps({ params }) {
    const dbName = process.env.DB_NAME;
    const reference = params.reference;
    let product = {};

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('products');
        product = await collection.findOne({ reference: reference });
        delete product._id;
    } catch (err) {
        console.log(err);
        await client.close();
    }

    return {
        props: { product }
    }

}
