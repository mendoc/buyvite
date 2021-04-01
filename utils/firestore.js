import firebase from "firebase/app";
import "firebase/firestore";

let config = {
    apiKey: "AIzaSyDcCxKNSF7uUBen3rIGwEfwFQ9794zr4-Y",
    authDomain: "badol-65208.firebaseapp.com",
    databaseURL: "https://badol-65208.firebaseio.com",
    projectId: "badol-65208",
    storageBucket: "badol-65208.appspot.com",
    messagingSenderId: "718439703006",
    appId: "1:718439703006:web:5ca889110f50dc3707fd4f"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export default firebase.firestore();