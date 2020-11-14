require('dotenv').config();

const axios = require('axios');
const querystring = require('querystring');
const convert = require('xml-js');
const faunadb = require('faunadb'),
    q = faunadb.query;

let client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })

exports.handler = async (event, context) => {

    // Récupération des informations soumises
    let infos = JSON.parse(event.body);
    const numero = infos.numero || "";
    const produit = infos.produit || "";

    // Création de la référence
    let d = new Date();
    const reference = 'DI' + (d.getYear().toString().substr(-2)) + (d.getMonth() + 1) + (d.getDate()) + d.getMilliseconds() + Math.floor(Math.random() * 100) + 1;

    const date_creation = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0') + ' ' +
        String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0') + ':' +
        String(d.getSeconds()).padStart(2, '0');

    // Fonction de création de la transaction en base
    const createTrans = (d) => {
        return client.query(
            q.Create(
                q.Collection('transactions'),
                {
                    data: d
                },
            )
        )
            .then((ret) => {
                let params = {
                    tel_marchand: process.env.TEL_MARCHAND,
                    montant: d.montant,
                    ref: d.transaction_id,
                    tel_client: numero,
                    token: process.env.TOKEN,
                    action: 1,
                    service: 'REST',
                    operateur: 'AM',
                    agent: 'BuyVite'
                };
                return invokPVit(params);
            })
            .catch((err) => {
                console.log(err);
                return {
                    statusCode: 500,
                    body: err.description
                }
            });
    }

    // Fonction d'invocation de l'API de PVit
    const invokPVit = (params) => {
        return axios.post(process.env.BASE_URL, querystring.stringify(params))
            .then((res) => {
                let data = convert.xml2json(res.data, { compact: true, spaces: 4 });
                console.log(data);

                return {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: data
                };
            }).catch((err) => {
                console.log(err);
                return {
                    statusCode: 500,
                    body: "Une erreur s'est produite lors de la communication avec PVit"
                }
            });
    }

    // Récupération des information du produit
    return client.query(
        q.Paginate(
            q.Match(
                q.Index('product_by_ref'), produit
            )
        )
    )
        .then((page) => {
            if (page.data.length === 0) {
                console.log("Produit introuvable. ID : " + produit)
                return {
                    statusCode: 500,
                    body: "Produit introuvable. ID : " + produit
                }
            } else {
                let prod = page.data[0];
                console.log(prod)
                let trans = {
                    produit: prod[0],
                    montant: prod[1],
                    transaction_id: reference,
                    statut: 1,
                    client: numero,
                    date_creation: date_creation
                }
                return createTrans(trans);
            }
        })
        .catch((err) => {
            console.log(err.description)
            return {
                statusCode: 500,
                body: "Une erreur s'est produite lors de la récupération du produit"
            }
        })
}
