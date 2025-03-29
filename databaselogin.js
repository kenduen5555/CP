  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getAuth , signOut ,onAuthStateChanged,signInWithEmailAndPassword ,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
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

  const loginform = document.getElementById("loginForm")
  const formarea1 = document.getElementById("form-area")
  const welcome1 = document.getElementById("welcome")
  const logout1 = document.getElementById("logout")

//ถ้าเข้าสู่ระบบอยู่แล้วให้ไปหน้าprofile
  onAuthStateChanged(auth,(user)=>{
      if(user){
        showAlert()
      }else{
      }
    })

  //หลังกดปุ่มlogin
  loginform.addEventListener("submit",(e)=>{
    e.preventDefault()
    const email = loginform.email.value
    const password = loginform.password.value
    signInWithEmailAndPassword(auth,email,password)
    .then((result)=>{
      const user = result.user;
      localStorage.setItem("displayName", user.email);
      localStorage.setItem("email", user.email);
      showAlert();

    }).catch((error)=>{
      alert(error.message)
    })

  })

  const provider = new GoogleAuthProvider();
  auth.languageCode = 'th';

  function showAlert() {
    var alert = document.getElementById('alert');
    //console.log('Before:', alert.style.display);  // ตรวจสอบก่อนการแสดง
    alert.style.display = 'block';  // แสดงข้อความแจ้งเตือน
    //console.log('After:', alert.style.display);  // ตรวจสอบหลังจากการแสดง
    setTimeout(function() {
      alert.style.display = 'none';  // ซ่อนข้อความแจ้งเตือนหลังจาก 1.5 วินาที
      window.location.href = "profile.html";  // เปลี่ยนหน้าเว็บหลังจากแสดงแจ้งเตือน
    }, 1500);  // ตั้งเวลาเป็น 1500 มิลลิวินาที (1.5 วินาที)
  }

  const googlelogin = document.getElementById("googlelogin-btn")
  googlelogin.addEventListener("click",function(){
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;//ลบได้
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    const displayName = user.displayName;
    const email = user.email; 
    localStorage.setItem("displayName", user.displayName);
    localStorage.setItem("email", user.email);
    window.location.href = "profile.html";
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;//ลบได้
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);//ลบได้
    // ...
  });
  })