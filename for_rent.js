import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

const costumeList = document.getElementById("costumeList");
const nextPageBtn = document.getElementById("nextPageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");

let costumesAll = [];         // ดึงข้อมูลทั้งหมดเก็บไว้ตรงนี้
let itemsPerPage = 9;         // จำนวนชุดต่อหน้า
let currentPage = 1;
let tagFilter = null;

async function fetchAllCostumes() {
  let q = collection(db, "costumes");

  if (tagFilter) {
    q = query(q, where("tags", "array-contains", tagFilter));
  }

  q = query(q, orderBy("name"));

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
      costumeList.innerHTML = "<p>ไม่มีข้อมูลที่แสดง</p>";
      nextPageBtn.style.display = 'none';
      prevPageBtn.style.display = page > 1 ? 'block' : 'none';
      return;
    }
  
    pageItems.forEach(costume => {
      const card = document.createElement("div");
      card.classList.add("costume-col", "mb-4");
    
      card.innerHTML = `
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
  
    // ปุ่มหน้า
    nextPageBtn.style.display = end < costumesAll.length ? 'block' : 'none';
    prevPageBtn.style.display = page > 1 ? 'block' : 'none';
  
    // อัปเดตช่องกรอกหมายเลขหน้า
    pageInput.value = currentPage;
  
    nextPageBtn.onclick = () => {
      currentPage++;
      sessionStorage.setItem('currentPage', currentPage);  // เก็บค่า page ใน sessionStorage
      renderCostumesPage(currentPage);
    };
    prevPageBtn.onclick = () => {
      currentPage--;
      sessionStorage.setItem('currentPage', currentPage);  // เก็บค่า page ใน sessionStorage
      renderCostumesPage(currentPage);
    };
  
    // เมื่อผู้ใช้กรอกหมายเลขหน้าและกด Enter
    pageInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const page = parseInt(pageInput.value);
        if (page >= 1 && page <= Math.ceil(costumesAll.length / itemsPerPage)) {
          currentPage = page;
          sessionStorage.setItem('currentPage', currentPage);  // เก็บค่า page ใน sessionStorage
          renderCostumesPage(currentPage);
        }
      }
    };
  }

async function init() {
  const params = new URLSearchParams(window.location.search);
  tagFilter = params.get("tag");
  const previousTag = sessionStorage.getItem("lastTag");
  if (previousTag !== tagFilter) {
    sessionStorage.removeItem("currentPage");
  }
  sessionStorage.setItem("lastTag", tagFilter);
  currentPage = parseInt(sessionStorage.getItem('currentPage')) || 1;  // ใช้ค่าจาก sessionStorage หากมี หรือใช้หน้า 1

  // แสดงชื่อแท็ก
  if (tagFilter) {
    tagTitleSection.innerHTML = `<h2>ชุดที่มีแท็ก: ${tagFilter}</h2>`;
  } else {
    tagTitleSection.innerHTML = `<h2>ชุดทั้งหมด</h2>`;
  }

  costumesAll = await fetchAllCostumes();
  renderCostumesPage(currentPage);
}

init();

