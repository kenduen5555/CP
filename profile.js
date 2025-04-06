import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { query, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqxJMhfeNGmXB-j143LN6uxsIYkmEiwLE",
  authDomain: "kkcos-d3a73.firebaseapp.com",
  projectId: "kkcos-d3a73",
  storageBucket: "kkcos-d3a73.firebasestorage.app",
  messagingSenderId: "400952081714",
  appId: "1:400952081714:web:c5bc2b7127a2e4be666b2b",
  measurementId: "G-VNG7PNZJZT"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const storeNameInput = document.getElementById('storeName');
const storeLinkInput = document.getElementById('storeLink');
const costumeCountSpan = document.getElementById("costumeCount");
const updateProfileForm = document.getElementById('updateProfileForm');
const logout = document.getElementById("logout");

const displayName = localStorage.getItem("displayName");
const email = localStorage.getItem("email");

// แสดงชื่อผู้ใช้และอีเมล
if (displayName) {
  document.getElementById("welcome").innerText = `ยินดีต้อนรับ, ${displayName}`;
} else {
  document.getElementById("welcome").innerText = "ยินดีต้อนรับ, ผู้ใช้ที่ไม่ได้ตั้งชื่อ";
}

// ตรวจสอบสถานะการล็อกอิน
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      // ดึงข้อมูลร้านค้า
      const storeDocRef = doc(db, 'stores', user.uid);
      const storeDoc = await getDoc(storeDocRef);

      if (storeDoc.exists()) {
        const storeData = storeDoc.data();
        storeNameInput.value = storeData.storeName || "";
        storeLinkInput.value = storeData.storeLink || "";
      } else {
        alert("กรุณากรอกข้อมูลร้านค้า!");
      }

      const costumesRef = collection(db, "costumes");
      const q = query(costumesRef, where("userId", "==", user.uid));
      const costumeSnapshot = await getDocs(q);
      costumeCountSpan.textContent = costumeSnapshot.size;

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลร้านค้า:", error);
    }
  } else {
    window.location.href = "login.html";
  }
});

// ฟังก์ชันอัปเดตข้อมูลร้าน
updateProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // หยุดไม่ให้หน้ารีเฟรช

  const user = auth.currentUser;
  if (!user) {
    alert("กรุณาเข้าสู่ระบบก่อนทำการอัปเดต");
    return;
  }

  const newStoreName = storeNameInput.value.trim();
  const newStoreLink = storeLinkInput.value.trim();

  if (!newStoreName || !newStoreLink) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    // อัปเดตข้อมูลร้านค้า
    await setDoc(doc(db, 'stores', user.uid), {
      storeName: newStoreName,
      storeLink: newStoreLink,
      ownerId: user.uid
    }, { merge: true });

    alert("ข้อมูลร้านค้าอัปเดตเรียบร้อยแล้ว!");
    
    // รีเฟรชหน้าเพื่อให้เห็นการเปลี่ยนแปลง
    location.reload();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดต:", error);
    alert("ไม่สามารถอัปเดตข้อมูลได้");
  }
});

logout.addEventListener("click",(e)=>{
  signOut(auth).then(()=>{
    localStorage.removeItem("displayName");  // ลบข้อมูลออกจาก localStorage
    localStorage.removeItem("email");
    alert("ออกจากระบบเรียบร้อย")
    window.location.href = "login.html";
  }).catch((error)=>{
    alert(error.message)
  })

})

// เมื่อผู้ใช้เข้าสู่ระบบ
window.onload = function() {
  // ลบข้อมูลออกจากระบบที่เก็บไว้ใน localStorage เมื่อเข้าสู่ระบบใหม่
  localStorage.removeItem("signOutTimeout");

  // ตั้งเวลาการออกจากระบบใหม่
  localStorage.setItem("signOutTimeout", Date.now() + (5 * 60 * 60 * 1000)); // 5 ชม.
  checkSignOutTimeout();
};

// ฟังก์ชันที่ใช้ตรวจสอบเวลาออกจากระบบ
function checkSignOutTimeout() {
  const timeoutTime = parseInt(localStorage.getItem("signOutTimeout"));
  const currentTime = Date.now();

  // ถ้าเวลาผ่านไปแล้ว
  if (currentTime >= timeoutTime) {
    signOutUser(); // ออกจากระบบ
  } else {
    const remainingTime = timeoutTime - currentTime;
    setTimeout(signOutUser, remainingTime); // ตั้งเวลาใหม่หลังจากเวลาที่เหลือ
  }
}

// ฟังก์ชันออกจากระบบ
function signOutUser() {
  signOut(auth).then(() => {
    localStorage.removeItem("displayName");  // ลบข้อมูลออกจาก localStorage
    localStorage.removeItem("email");
    alert("ออกจากระบบเรียบร้อย");
    window.location.href = "login.html";
  }).catch((error) => {
    alert(error.message);
  });
}
