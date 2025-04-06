import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

const storeInfoDiv = document.getElementById("storeInfo");
const costumeList = document.getElementById("costumeList");
const nextPageBtn = document.getElementById("nextPageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");

let costumesAll = [];
let itemsPerPage = 9;
let scurrentPage = 1;

// ดึง storeId จาก URL
const params = new URLSearchParams(window.location.search);
const storeId = params.get("id");

// ตรวจสอบว่าร้านเปลี่ยนไหม
const lastStoreId = sessionStorage.getItem('lastStoreId');

if (lastStoreId !== storeId) {
  sessionStorage.removeItem('scurrentPage');
  sessionStorage.setItem('lastStoreId', storeId);
}

// ดึง scurrentPage ใหม่หลังจากเคลียร์
scurrentPage = Number(sessionStorage.getItem('scurrentPage')) || 1;

if (!storeId) {
  storeInfoDiv.innerHTML = "<p class='text-danger'>ไม่พบรหัสร้าน</p>";
} else {
  init();
}

async function init() {
  await loadStoreInfo(storeId);
  costumesAll = await loadCostumesByStore(storeId);
  renderCostumesPage(scurrentPage);
}

async function loadStoreInfo(id) {
    const storeRef = doc(db, "stores", id); // สร้าง reference ไปยังเอกสารที่มี id นี้ในคอลเลกชัน stores
    const storeSnap = await getDoc(storeRef); // ดึงข้อมูลเอกสารจาก Firestore
  
    if (storeSnap.exists()) { // ถ้าเอกสารมีข้อมูล
      const store = storeSnap.data(); // ดึงข้อมูลจากเอกสาร
  
      // ถ้ามีชื่อร้าน, แสดงชื่อร้าน และลิงก์
      if (store.storeName) {
        storeInfoDiv.innerHTML = `
          <h1 class="mb-1">ร้าน : ${store.storeName}</h1>
          <h>ลิ้งค์ไปยังหน้าร้าน : <a href="${store.storeLink}" target="_blank">${store.storeLink}</a><h5>
        `;
      } else {
        // ถ้าไม่มีชื่อร้าน, แสดงแค่ลิงก์
        storeInfoDiv.innerHTML = `
        <p class='text-danger'>ร้านนี้ไม่ได้ตั้งชื่อ</p>
        <h7>ลิ้งค์ไปยังหน้าร้าน : <a href="${store.storeLink}" target="_blank">${store.storeLink}</a><h5>
        `;
      }
    } else {
      storeInfoDiv.innerHTML = "<p class='text-danger'>ร้านนี้ไม่ได้ตั้งชื่อ</p>"; // ถ้าไม่มีข้อมูล
    }
  }
  

async function loadCostumesByStore(id) {
  const costumesRef = collection(db, "costumes");
  const q = query(costumesRef, where("userId", "==", id), orderBy("name"));

  const snapshot = await getDocs(q);
  const all = [];
  snapshot.forEach(doc => {
    all.push({ ...doc.data(), id: doc.id });
  });

  return all;
}

function renderCostumesPage(page) {
  costumeList.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = costumesAll.slice(start, end);

  if (pageItems.length === 0) {
    costumeList.innerHTML = "<p>ไม่มีชุดในร้านนี้</p>";
    nextPageBtn.style.display = 'none';
    prevPageBtn.style.display = page > 1 ? 'block' : 'none';
    return;
  }

  pageItems.forEach(costume => {
    const card = document.createElement("div");
    card.classList.add("costume-col", "mb-4");

    card.innerHTML = `
            <div class="col-md-12 mb-4">
                <div class="custom-card shadow-lg">
                    <img src="${costume.imageUrl}" class="card-img-top" alt="${costume.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${costume.name}</h5>
          <a href="view_costume.html?id=${costume.id}" class="btn btn-primary">รายละเอียด</a>
                    </div>
                </div>
    `;

    costumeList.appendChild(card);
  });

  nextPageBtn.style.display = end < costumesAll.length ? 'block' : 'none';
  prevPageBtn.style.display = page > 1 ? 'block' : 'none';

    // อัปเดตช่องกรอกหมายเลขหน้า

  nextPageBtn.onclick = () => {
    scurrentPage++;
    sessionStorage.setItem('scurrentPage', scurrentPage);  // เก็บค่า page ใน sessionStorage
    renderCostumesPage(scurrentPage);
  };
  prevPageBtn.onclick = () => {
    scurrentPage--;
    sessionStorage.setItem('scurrentPage', scurrentPage);  // เก็บค่า page ใน sessionStorage
    renderCostumesPage(scurrentPage);
  };
}
