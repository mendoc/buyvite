import { useState } from "react";
import { payProduct } from '../utils/Request';

export default function Home() {

    const [processing, setProcessing] = useState(false);
    const [numero, setNumero] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        payProduct(numero, '', (err, res) => {
            setProcessing(false);
            if (err) console.dir(err);
            else console.log(res);
        });
    }

    const handleChange = (e) => {
        setNumero(e.target.value);
    }

    return (
        <div className={`${processing ? 'processing' : ''}`}>
            <div
                className="loading hidden flex px-5 text-center text-white flex-col justify-center fixed inset-0 z-50 bg-black bg-opacity-75">
                <img className="w-16 self-center" src="assets/img/load.gif" alt="Image de chargement" />
                <span>Traitement en cours <br /> Veuillez patienter s'il vous plaît</span>
            </div>
            <div className="md:flex md:max-w-screen-md md:mt-5 md:m-auto" id="content">
                <header className="bg-gray-200 py-4 md:w-1/2">
                    <img className="h-64 md:h-auto md:w-full m-auto rounded"
                        src="assets/img/cover-rich-dad.jpg"
                        alt="Image du livre" />
                </header>
                <main className="p-5 md:w-1/2">
                    <span className="inline-block pt-2 pb-1 px-2 text-lg font-bold bg-gray-400 rounded my-4">100 F CFA</span>
                    <h1 className="font-bold text-2xl">Père riche, père pauvre</h1>
                    <p className="my-5">Ce livre est une oeuvre de Robert Kiyosaki et de Sharon Lechter paru en 1997. De style
                    autobiographique, Robert Kiyosaki utilise un ensemble de paraboles et d'exemples tirés de son propre
                parcours afin de souligner l'importance de développer son intelligence financière.</p>
                    <form className="border-t pt-4" onSubmit={handleSubmit}>
                        <h2 className="font-bold mb-2">Acheter le livre via Airtel Money</h2>
                        <label htmlFor="numero">Votre numéro</label>
                        <input className="w-full border outline-none py-2 px-1" type="tel" value={numero} onChange={handleChange} name="numero"
                            placeholder="ex: 074123456" required spellCheck={false} />
                        <input className="rounded py-3 text-lg font-bold mt-4 text-white w-full bg-green-500" type="submit"
                            id="btnAcheter" value="Acheter" />
                    </form>
                </main>
            </div>
        </div>
    )
}