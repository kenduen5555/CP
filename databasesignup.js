  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getAuth , createUserWithEmailAndPassword,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
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

  const form = document.getElementById("signupForm")
  const formarea = document.getElementById("form-area")
  const profile = document.getElementById("profile")
  const welcome = document.getElementById("welcome")
  const logout = document.getElementById("logout")

//ถ้าเข้าสู่ระบบอยู่แล้วให้ไปหน้าprofile
onAuthStateChanged(auth,(user)=>{
  if(user){
    showAlert()
  }else{
  }
})

  form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const email = form.email.value
    const password = form.password.value
    createUserWithEmailAndPassword(auth,email,password)
    .then((result)=>{
      const user = result.user;
      localStorage.setItem("displayName", user.email);
      localStorage.setItem("email", user.email);
      showAlert();
    }).catch((error)=>{
      alert(error.message)
    })

  })

  function showAlert() {
    var alert = document.getElementById('alert');
    //console.log('Before:', alert.style.display);  // ตรวจสอบก่อนการแสดง
    alert.style.display = 'block';  // แสดงข้อความแจ้งเตือน
    //console.log('After:', alert.style.display);  // ตรวจสอบหลังจากการแสดง
    setTimeout(function() {
      alert.style.display = 'none';  // ซ่อนข้อความแจ้งเตือนหลังจาก 1.5 วินาที
    }, 1500);  // ตั้งเวลาเป็น 1500 มิลลิวินาที (1.5 วินาที)
  }

  onAuthStateChanged(auth,(user)=>{

    if(user){
      profile.style.display="block"
      formarea.style.display="none"
      welcome.innerText=`ยินดีต้อนรับ${user.email}`
    }else{
      profile.style.display="none"
      formarea.style.display="block"
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
