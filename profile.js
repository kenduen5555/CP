import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth,signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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

const auth = getAuth(app)

const logout = document.getElementById("logout")

const displayName = localStorage.getItem("displayName");
const email = localStorage.getItem("email");

// แสดงชื่อผู้ใช้และอีเมล
if (displayName) {
  document.getElementById("welcome").innerText = `ยินดีต้อนรับ, ${displayName}`;
} else {
  document.getElementById("welcome").innerText = "ยินดีต้อนรับ, ผู้ใช้ที่ไม่ได้ตั้งชื่อ";
}

/* if (email) {
  document.getElementById("email").innerText = `อีเมล: ${email}`;
} */


onAuthStateChanged(auth,(user)=>{
    if(user){
    }else{
      window.location.href = "login.html";
    }
  })

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
