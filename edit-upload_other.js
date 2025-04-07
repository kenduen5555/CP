import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc ,query, where, getDocs , getDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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

// ... import และ config Firebase เหมือนเดิม ...

// ✅ รอให้ DOM โหลดครบก่อน
window.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "login.html";
        return;
      }
  
      const form = document.getElementById("uploadForm");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById("imageFile");
        const category = document.getElementById("category").value;
        const submitBtn = form.querySelector("button[type='submit']");
        const file = fileInput.files[0];
        if (!file) {
          alert("กรุณาเลือกไฟล์");
          return;
        }
  
        submitBtn.disabled = true;
        submitBtn.textContent = "กำลังอัปโหลด...";
  
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "testupload");
  
        const cloudName = "ddafghhjl";
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  
        try {
          const response = await fetch(cloudinaryUrl, { method: "POST", body: formData });
          const result = await response.json();
  
          if (result.secure_url) {
            const imageUrl = result.secure_url;
            const deleteToken = result.delete_token;
  
            // ตรวจสอบว่ามีภาพหลักในหมวดนี้อยู่แล้วไหม
            const qMain = query(collection(db, "portfolio"), where("storeId", "==", user.uid), where("type", "==", category), where("isMain", "==", true));
            const snapshotMain = await getDocs(qMain);
            const isMain = snapshotMain.empty;
  
            const newDocRef = doc(collection(db, "portfolio"));
            await setDoc(newDocRef, {
              storeId: user.uid,
              imageUrl,
              type: category,
              isMain,
              timestamp: new Date()
            });
  
            await setDoc(doc(db, "deleteTokens", newDocRef.id), {
              storeId: user.uid,
              deleteToken
            });
  
            alert("อัปโหลดสำเร็จ");
            form.reset();
            location.reload();
          } else {
            console.error("Cloudinary Error:", result);
            alert("เกิดข้อผิดพลาดจาก Cloudinary");
          }
        } catch (err) {
          console.error("เกิดข้อผิดพลาด:", err);
          alert("ไม่สามารถอัปโหลดภาพได้");
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "อัปโหลด";
        }
      });
  
      const makeupRow = document.getElementById("makeupRow");
      const photographyRow = document.getElementById("photographyRow");
  
      function createImageCard(docId, imageUrl, type, isMain) {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";
      
        col.innerHTML = `
          <div class="card image-card">
            ${isMain ? `<div class="main-image-badge">ภาพหลัก</div>` : ""}
            <img src="${imageUrl}" class="card-img-top" alt="image">
            <div class="card-body">
              <select class="form-select mb-2 type-select" ${isMain ? "disabled" : ""}>
                <option value="makeup" ${type === "makeup" ? "selected" : ""}>ช่างแต่งหน้า</option>
                <option value="photography" ${type === "photography" ? "selected" : ""}>ช่างภาพ</option>
              </select>
              <button class="btn btn-sm btn-warning me-2 change-image">เปลี่ยนภาพ</button>
              <input type="file" class="d-none image-input">
              <button class="btn btn-sm btn-primary me-2 save">บันทึก</button>
              <button class="btn btn-sm btn-danger me-2 delete">ลบ</button>
              ${!isMain ? `<button class="btn btn-sm btn-outline-danger set-main">ตั้งเป็นภาพหลัก</button>` : ""}
            </div>
          </div>
        `;
      
        const select = col.querySelector(".type-select");
        const saveBtn = col.querySelector(".save");
        const deleteBtn = col.querySelector(".delete");
        const changeBtn = col.querySelector(".change-image");
        const inputFile = col.querySelector(".image-input");
        const img = col.querySelector("img");
        const setMainBtn = col.querySelector(".set-main");
      
        saveBtn.addEventListener("click", async () => {
          if (isMain) {
            alert("ไม่สามารถเปลี่ยนประเภทของภาพหลักได้");
            return;
          }
      
          await setDoc(doc(db, "portfolio", docId), { type: select.value }, { merge: true });
          alert("บันทึกเรียบร้อยแล้ว");
          location.reload();
        });
      
        changeBtn.addEventListener("click", () => inputFile.click());
      
        inputFile.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;
      
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "testupload");
      
          const response = await fetch(`https://api.cloudinary.com/v1_1/ddafghhjl/upload`, {
            method: "POST",
            body: formData
          });
          const result = await response.json();
      
          if (result.secure_url) {
            const newUrl = result.secure_url;
            const newToken = result.delete_token;
      
            const oldTokenDoc = await getDoc(doc(db, "deleteTokens", docId));
            if (oldTokenDoc.exists()) {
              const oldToken = oldTokenDoc.data().deleteToken;
              await fetch(`https://api.cloudinary.com/v1_1/ddafghhjl/delete_by_token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: oldToken })
              });
            }
      
            await setDoc(doc(db, "portfolio", docId), { imageUrl: newUrl }, { merge: true });
            await setDoc(doc(db, "deleteTokens", docId), { deleteToken: newToken }, { merge: true });
      
            img.src = newUrl;
            alert("เปลี่ยนภาพเรียบร้อยแล้ว");
            location.reload();
          }
        });
      
        deleteBtn.addEventListener("click", async () => {
          if (!confirm("ต้องการลบภาพนี้จริงหรือไม่?")) return;
      
  // เช็คว่าเป็นภาพหลักหรือไม่
  if (isMain) {
    alert("ไม่สามารถลบภาพหลักได้");
    return; // ถ้าเป็นภาพหลัก จะไม่ให้ลบ
  }
          
          const tokenDoc = await getDoc(doc(db, "deleteTokens", docId));
          if (tokenDoc.exists()) {
            const deleteToken = tokenDoc.data().deleteToken;
            await fetch(`https://api.cloudinary.com/v1_1/ddafghhjl/delete_by_token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: deleteToken })
            });
            await deleteDoc(doc(db, "deleteTokens", docId));
          }
      
          await deleteDoc(doc(db, "portfolio", docId));
          alert("ลบภาพเรียบร้อยแล้ว");
          location.reload();
        });
      
        if (setMainBtn) {
          setMainBtn.addEventListener("click", async () => {
            const qSameType = query(collection(db, "portfolio"), where("storeId", "==", user.uid), where("type", "==", type));
            const snapshot = await getDocs(qSameType);
      
            const batchUnmark = snapshot.docs.map(d => setDoc(doc(db, "portfolio", d.id), { isMain: false }, { merge: true }));
            await Promise.all(batchUnmark);
      
            await setDoc(doc(db, "portfolio", docId), { isMain: true }, { merge: true });
            alert("ตั้งภาพหลักเรียบร้อยแล้ว");
            location.reload();
          });
        }
      
        if (type === "makeup") makeupRow.appendChild(col);
        else photographyRow.appendChild(col);
      }
  
// ประกาศตัวแปรเพื่อเก็บข้อมูลภาพ
let makeupImages = [];
let photographyImages = [];
      
const q = query(collection(db, "portfolio"), where("storeId", "==", user.uid));
const snapshot = await getDocs(q);

// เก็บข้อมูลภาพในตัวแปร makeupImages และ photographyImages
snapshot.forEach(docSnap => {
  const data = docSnap.data();
  if (data.type === "makeup") {
    makeupImages.push({ id: docSnap.id, ...data });
  } else {
    photographyImages.push({ id: docSnap.id, ...data });
  }
});

// จัดเรียงภาพหลักให้อยู่ข้างบนก่อน
makeupImages.sort((a, b) => b.isMain - a.isMain);
photographyImages.sort((a, b) => b.isMain - a.isMain);

// สร้างการ์ดภาพ
makeupImages.forEach(data => createImageCard(data.id, data.imageUrl, data.type, data.isMain));
photographyImages.forEach(data => createImageCard(data.id, data.imageUrl, data.type, data.isMain));

    });
  });
  