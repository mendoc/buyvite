import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from "react";

export default function ShareButton({ lien }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 3000)
    }

    return (
        <CopyToClipboard text={lien} onCopy={handleCopy}>
            {copied ?
                <span className="flex items-center text-sm cursor-pointer self-start py-1 px-2 rounded text-blue-900 border bg-white">
                    <svg className="h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                Lien copié
            </span>
                :
                <span className="flex items-center text-sm cursor-pointer self-start py-1 px-2 rounded text-white bg-blue-900">
                    <svg className="h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                Copier le lien de vente
            </span>
            }
        </CopyToClipboard>
    )
}