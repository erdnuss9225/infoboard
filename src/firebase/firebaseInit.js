import firebase from "firebase/app"
import "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBe3PtVPLNb4lKFnOJP11IzMXIawHMI35g",
    authDomain: "blog-firebase-4ee26.firebaseapp.com",
    projectId: "blog-firebase-4ee26",
    storageBucket: "blog-firebase-4ee26.appspot.com",
    messagingSenderId: "632792390041",
    appId: "1:632792390041:web:2e68529513bdbf53b15b08"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();