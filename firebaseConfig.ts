
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCBoysjixSQiGVeGUpfDaqlb4BlOtHPpRE",
  authDomain: "kb-react-naitve-storage.firebaseapp.com",
  projectId: "kb-react-naitve-storage",
  storageBucket: "kb-react-naitve-storage.appspot.com",
  messagingSenderId: "209819483183",
  appId: "1:209819483183:web:1c42ef65843b7a419d5ada"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app)