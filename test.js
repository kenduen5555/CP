  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  async function getstore(db){
    const stCol = collection(db,'store')
    const stSnapshot = await getDocs(stCol)
    return stSnapshot 
  }
//แชทเพิ่ม
async function getItemsForStore(storeId) {
    const itemsCol = collection(db, 'store', storeId, 'items');  // Reference to 'items' subcollection
    const itemsSnapshot = await getDocs(itemsCol);  // Get documents from 'items' subcollection
    return itemsSnapshot;
  }
//แชทเพิ่ม

async function showData(store_1){
    console.log(store_1.data());

//เพิ่ม
const storeId = store_1.id;  // Get the document ID of the store
const itemsData = await getItemsForStore(storeId);  // Get data from 'items' subcollection
itemsData.forEach(itemDoc => {
    const itemData = itemDoc.data();
    console.log(itemData);
  });
//เพิ่ม

}

  const data = await getstore(db)
  data.forEach(store_1=>{
    showData(store_1)
  })



  







