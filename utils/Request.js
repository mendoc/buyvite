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

const getProducts = (email, cb) => {

    fetch(`/api/products?email=${email}`)
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

const generateLink = (product, cb) => {

    fetch(`/api/generate`,
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


const getUserInfos = (infos, cb) => {

    fetch(`/api/user`,
        {
            method: "POST",
            body: JSON.stringify(infos)
        })
        .then((response) => {
            if (response.ok) {
                console.log(response);
                response.json().then((data) => {
                    cb(null, data);
                });
            } else {
                cb(response);
            }
        })
        .catch((error) => {
            cb(error.message);
        });
}


exports.payProduct = payProduct;
exports.generateLink = generateLink;
exports.getProducts = getProducts;
exports.getUserInfos = getUserInfos;