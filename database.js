import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// ✅ ตั้งค่า Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBqxJMhfeNGmXB-j143LN6uxsIYkmEiwLE",
  authDomain: "kkcos-d3a73.firebaseapp.com",
  projectId: "kkcos-d3a73",
  storageBucket: "kkcos-d3a73.appspot.com",
  messagingSenderId: "400952081714",
  appId: "1:400952081714:web:c5bc2b7127a2e4be666b2b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ โหลดภาพหลักของ Makeup Artist
window.addEventListener("DOMContentLoaded", async () => {
  const queryMain = query(
    collection(db, "portfolio"),
    where("type", "==", "makeup"),
    where("isMain", "==", true)
  );

  const snapshotMain = await getDocs(queryMain);
  const artistmuContainer = document.getElementById("artistmu-container");

  snapshotMain.forEach(docSnap => {
    const data = docSnap.data();
    const storeId = data.storeId;
    const imageUrl = data.imageUrl;

    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card image-card">
        <img src="${imageUrl}" class="card-img-top" alt="image">
        <div class="card-body text-center">
          <a href="store_page_artistmu.html?id=${storeId}" class="btn btn-primary">รายละเอียด</a>
        </div>
      </div>
    `;
    artistmuContainer.appendChild(col);
  });
});
