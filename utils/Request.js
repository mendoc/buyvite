const payProduct = (number, product, cb) => {

    fetch(`/api/pay`,
        {
            method: "POST",
            body: JSON.stringify({ number, product })
        })
        .then((response) => {
            response.json().then((data) => {
                if (response.ok) {
                    cb(null, data);
                } else {
                    cb(data);
                }
            }).catch(() => {
                cb({ message: 'Zut! Impossible de traiter la requête pour le moment' });
            });
        })
        .catch((error) => {
            cb(error);
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
exports.getUserInfos = getUserInfos;