import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase config
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

const searchInput = document.getElementById("searchInput");
const suggestionsDiv = document.getElementById("suggestions");

let allTags = [];

// โหลด tag ทั้งหมดจากคอลเลกชัน tags
async function fetchTags() {
  try {
    const tagsSnap = await getDocs(collection(db, "tags"));
    // ใช้ document ID เป็นชื่อ tag โดยดึงข้อมูลจากฟิลด์ `name`
    allTags = tagsSnap.docs.map(doc => doc.data().name); 
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดแท็ก:", error);
  }
}

fetchTags();

// ฟัง input event
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  suggestionsDiv.innerHTML = "";

  if (query === "") return;

  const matched = allTags.filter(tag => tag.includes(query));

  if (matched.length === 0) {
    suggestionsDiv.innerHTML = `<div class="list-group-item disabled text-muted">ไม่พบแท็กที่เกี่ยวข้อง</div>`;
    return;
  }

  matched.forEach(tag => {
    const item = document.createElement("a");
    item.classList.add("list-group-item", "list-group-item-action");
    item.textContent = tag;
    item.href = `For rent.html?tag=${encodeURIComponent(tag)}`;
    suggestionsDiv.appendChild(item);
  });
});

// ถ้า user คลิกข้างนอก กล่อง suggestion จะหายไป
document.addEventListener("click", (e) => {
  if (!suggestionsDiv.contains(e.target) && e.target !== searchInput) {
    suggestionsDiv.innerHTML = "";
  }
});

// HTML element
const storeSearchInput = document.getElementById("storeSearchInput");
const storeSuggestionsDiv = document.getElementById("storeSuggestions");

let allStores = [];

// ฟังก์ชันการโหลดข้อมูลชื่อร้านจาก Firestore
async function fetchStores() {
  try {
    const storesSnap = await getDocs(collection(db, "stores"));
    // ดึงชื่อร้านจาก path '/stores/{storeId}/storeName'
    allStores = storesSnap.docs.map(doc => ({
      id: doc.id,
      storeName: doc.data().storeName // เก็บชื่อร้านจาก storeName
    }));
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดร้าน:", error);
  }
}

// เรียกใช้งานฟังก์ชันดึงข้อมูลร้าน
fetchStores();

// ฟัง input event สำหรับการค้นหาชื่อร้าน
storeSearchInput.addEventListener("input", () => {
  const query = storeSearchInput.value.toLowerCase().trim();
  storeSuggestionsDiv.innerHTML = "";

  if (query === "") return;

  const matched = allStores.filter(store => {
    // ตรวจสอบให้แน่ใจว่า storeName มีค่าและเปรียบเทียบกับ query
    return store.storeName && store.storeName.toLowerCase().includes(query);
  });

  if (matched.length === 0) {
    storeSuggestionsDiv.innerHTML = `<div class="list-group-item disabled text-muted">ไม่พบร้านที่เกี่ยวข้อง</div>`;
    return;
  }

  matched.forEach(store => {
    const item = document.createElement("a");
    item.classList.add("list-group-item", "list-group-item-action");
    item.textContent = store.storeName; // แสดงชื่อร้าน
    item.href = `store_page.html?id=${store.id}`;  // ลิงก์ไปยังหน้าร้าน
    storeSuggestionsDiv.appendChild(item);
  });
});

// ถ้า user คลิกข้างนอก กล่อง suggestion จะหายไป
document.addEventListener("click", (e) => {
  if (!storeSuggestionsDiv.contains(e.target) && e.target !== storeSearchInput) {
    storeSuggestionsDiv.innerHTML = "";
  }
});