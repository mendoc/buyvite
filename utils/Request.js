const payProduct = (numero, produit, cb) => {

    let product = {
        numero: numero,
        produit: produit
    }

    fetch(`/api/pay`,
        {
            method: "POST",
            body: JSON.stringify(product)
        })
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    cb(null, data);
                });
            } else {
                cb('Mauvaise réponse du réseau');
            }
        })
        .catch((error) => {
            cb(error.message);
        });
}

exports.payProduct = payProduct;