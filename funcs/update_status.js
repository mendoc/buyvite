const convert = require('xml-js');
require('dotenv').config();
const faunadb = require('faunadb'),
    q = faunadb.query;

let client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET })

exports.handler = async (event, context) => {

    if (event.httpMethod !== "POST") {
        return { statusCode: 401, body: "Unauthorized" };
    }

    let infos = event.body;
    let data = convert.xml2json(infos, { compact: true, spaces: 4 });

    console.log(data);

    data = JSON.parse(data);
    let reponse = data.REPONSE;

    let statut = reponse.STATUT._text;
    let reference = reponse.REF._text;

    if (statut === '200') {
        client.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index('transaction_by_id'), reference
                    )
                ),
                q.Lambda('document', q.Update(q.Var('document'), { data: { statut: statut } }))
            ),
        )
            .then((transaction) => {
                console.log(`Transaction ${reference}  mise à jour`)
            })
            .catch((err) => console.log(err.description))
    }

    return {
        statusCode: 200,
        body: JSON.stringify(reponse)
    };
}
