import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

// รับ id ของชุดจาก URL
const urlParams = new URLSearchParams(window.location.search);
const costumeId = urlParams.get("id");

const costumeDetails = document.getElementById("costumeDetails");
const tagsSection = document.getElementById("tagsSection");
const storeLinkSection = document.getElementById("storeLinkSection");

// ฟังก์ชันดึงข้อมูลชุดจาก Firestore
async function getCostumeDetails() {
    const costumeRef = doc(db, "costumes", costumeId);
    const costumeSnap = await getDoc(costumeRef);

    if (costumeSnap.exists()) {
        const costume = costumeSnap.data();

        // แสดงรายละเอียดชุด
        costumeDetails.innerHTML = `
            <div class="col-md-12 mb-4">
                <div class="card shadow-lg">
                    <img src="${costume.imageUrl}" class="card-img-top" alt="${costume.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${costume.name}</h5>
                        <p class="card-text">${costume.description || "ไม่มีรายละเอียด"}</p>
                    </div>
                </div>
            </div>
        `;

        // แสดงแท็ก
        if (costume.tags && costume.tags.length > 0) {
            let tagsHtml = '<h6>แท็ก:</h6><div class="btn-group">';
            costume.tags.forEach(tag => {
                tagsHtml += `<a href="For%20rent.html?tag=${tag}" class="btn btn-secondary mx-1">${tag}</a>`;
            });
            tagsHtml += '</div>';
            tagsSection.innerHTML = tagsHtml;
        } else {
            tagsSection.innerHTML = '<p>ไม่มีแท็กสำหรับชุดนี้</p>';
        }

        // ลิงค์ไปหน้าร้าน
        if (costume.userId) { // ใช้ userId แทน storeId
            const storeRef = doc(db, "stores", costume.userId); // ดึงข้อมูลร้านจาก userId ของชุด
            const storeSnap = await getDoc(storeRef);

            if (storeSnap.exists()) {
                const store = storeSnap.data();
                storeLinkSection.innerHTML = `
                    <h6>ดูชุดทั้งหมดของร้าน ${store.storeName}</h6>
                    <a href="store_page.html?id=${costume.userId}" class="btn btn-primary">ไปยังร้านนี้</a>
                `;
            } else {
                storeLinkSection.innerHTML = '<p>ไม่พบข้อมูลร้าน</p>';
            }
        } else {
            storeLinkSection.innerHTML = '<p>ชุดนี้ไม่ได้เชื่อมโยงกับร้านใด</p>';
        }
    } else {
        costumeDetails.innerHTML = `<p>ไม่พบข้อมูลชุดนี้</p>`;
    }
}

// เรียกฟังก์ชัน
getCostumeDetails();
