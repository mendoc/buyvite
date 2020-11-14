(function () {
    const BASE_URL = "https://buyvite.netlify.app/.netlify/functions";
    //const BASE_URL = "http://localhost:9000";

    let loader = document.querySelector('.hidden');

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        loading();
        sendData();
    });

    const loading = () => {
        loader.classList.remove('hidden');
        document.querySelector('#content').classList.add('blur');
        document.querySelector('body').classList.add('overflow-hidden');
    }

    const hideLoading = () => {
        loader.classList.add('hidden');
        document.querySelector('#content').classList.remove('blur');
        document.querySelector('body').classList.remove('overflow-hidden');
    }

    const sendData = () => {
        let numeroChamp = document.querySelector('#numero');
        let produitChamp = document.querySelector('#produit');

        let data = {
            numero: numeroChamp.value,
            produit: produitChamp.value
        }

        fetch(`${BASE_URL}/payment`,
            {
                method: "POST",
                body: JSON.stringify(data)
            })
            .then(function (response) {
                if (response.ok) {
                    response.json().then(console.log);
                    numeroChamp.value = "";
                } else {
                    console.log('Mauvaise réponse du réseau');
                }
                hideLoading();
            })
            .catch(function (error) {
                console.error(error.message);
                hideLoading();
            });
    }
})();