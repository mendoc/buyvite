import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateLink } from '../utils/Request';
import fb from '../utils/fb';
import { v4 as uuidv4 } from 'uuid';

export default function Create() {
    const [user, setUser] = useState({});
    const [processing, setProcessing] = useState(false);
    const [product, setProduct] = useState({});
    const [file, setFile] = useState({});
    const [preview, setPreview] = useState('');
    const [cookies, setCookie] = useCookies(['token']);
    const router = useRouter();

    useEffect(() => {
        if (!cookies.token) {
            router.push('/')
        } else {
            setUser(jwt_decode(cookies.token));
        }
    }, [])

    if (!cookies.token) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        setProcessing(true);

        const stoRef = fb.st.ref();

        const metadata = {
            'contentType': file.type
        };

        stoRef.child('images/' + uuidv4()).put(file, metadata).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (url) {
                console.log('File available at', url);
                generateLink({ ...product, image: url }, (err, res) => {
                    setProcessing(false);
                    if (err) console.dir(err);
                    else {
                        router.push(`/user/${res.user}`);
                    }
                })
            }).catch(err => {
                console.log(err);
                setProcessing(false);
            });
        }).catch(err => {
            console.log(err);
            setProcessing(false);
        });
    }

    const handleFileChange = (e) => {
        let reader = new FileReader();
        let f = e.target.files[0];

        reader.onloadend = () => {
            setFile(f);
            setPreview(reader.result);
        }

        reader.readAsDataURL(f);
    }

    const handleChange = (e) => {
        let p = product;
        p[e.target.name] = e.target.value;
        p.user = user.email;
        setProduct(p);
    }

    return (
        <div className="px-5">
            <div className="flex justify-between items-center my-3">
                <span>BuyVite</span>
                <div className="flex items-center">
                    <img className="w-10 rounded-full mr-3" src={user.picture} />
                    <span>{user.name}</span>
                </div>
            </div>
            <hr />
            <div className="mt-5">
                <h2>Détails du produit</h2>
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div className="mt-3">
                        <label className="font-bold text-blue-900">Nom du produit</label>
                        <input name="name" onChange={handleChange} className="border w-full px-2 py-1 outline-none" type="text" placeholder="Ex : Montre en rafia" required />
                    </div>
                    <div className="mt-3">
                        <label className="font-bold text-blue-900">Image du produit</label>
                        <div className="flex items-center">
                            {preview && <img className="w-1/4 mr-3 rounded" src={preview} alt="preview" />}
                            <input name="file" onChange={handleFileChange} accept="image/*" className="text-blue-900 image-input outline-none" type="file" placeholder="Choisissez une image" required />
                        </div>
                    </div>
                    <div className="mt-3">
                        <label className="font-bold text-blue-900">Prix du produit</label>
                        <input name="price" onChange={handleChange} className="border w-full px-2 py-1 outline-none" type="number" placeholder="Ex : 13500" min="200" max="100000" required />
                    </div>
                    <div className="mt-3">
                        <label className="font-bold text-blue-900">Description du produit</label>
                        <textarea name="description" onChange={handleChange} className="border w-full px-2 py-1 outline-none" type="number" placeholder="Ex : Montre fait à base de composants naturels"></textarea>
                        <span className="text-sm italic text-gray-800 -mt-1 block">Facultatif</span>
                    </div>
                    {
                        !processing && <button type="submit" className="flex items-center text-sm cursor-pointer self-center py-1 px-2 mt-3 rounded text-white bg-blue-900">
                            <svg className="h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                            </svg>
                        Générer le lien
                        </button>
                    }
                </form>
            </div>
        </div>
    )
}