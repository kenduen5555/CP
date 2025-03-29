// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqxJMhfeNGmXB-j143LN6uxsIYkmEiwLE",
  authDomain: "kkcos-d3a73.firebaseapp.com",
  projectId: "kkcos-d3a73",
  storageBucket: "kkcos-d3a73.firebasestorage.app",
  messagingSenderId: "400952081714",
  appId: "1:400952081714:web:c5bc2b7127a2e4be666b2b",
  measurementId: "G-VNG7PNZJZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app)

// Function to get store data
async function getstore(db) {
  const stCol = collection(db, 'store');
  const stSnapshot = await getDocs(stCol);
  return stSnapshot;
}

// Function to show data from store and its subcollections
async function showData(store_1) {
  const storePath = `store/${store_1.id}`;  // Define the path to this store document
  console.log("Store Data:", store_1.data());  // Show store data

  const storeId = store_1.id;  // Get the document ID of the store
  const storeRef = doc(db, 'store', storeId);  // Get a reference to the store document

  // Manually specify the subcollections to retrieve
  const subcollections = ['type'];  // Subcollections you know exist

  for (const subcol of subcollections) {
    console.log(`Subcollection: ${subcol}`);  // Show the subcollection path

    // Get all documents in the subcollection
    const subColRef = collection(storeRef, subcol);  // Get reference to the subcollection
    const subColSnapshot = await getDocs(subColRef);  // Get all documents in this subcollection

    subColSnapshot.forEach(doc => {
      const docPath = `${storePath}/${subcol}/${doc.id}`;  // Path to each document in the subcollection
      console.log("Document Data:", doc.data());  // Show the data from the document
    });
  }
}

// Get all stores and their associated subcollections
const data = await getstore(db);
for (const store_1 of data.docs) {  // Loop through each store document
  await showData(store_1);  // Await to show data for each store
}
