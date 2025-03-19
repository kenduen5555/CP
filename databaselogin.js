  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
  import { getAuth , signOut ,onAuthStateChanged,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
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
  const profile1 = document.getElementById("profile")
  const welcome1 = document.getElementById("welcome")
  const logout1 = document.getElementById("logout")

  loginform.addEventListener("submit",(e)=>{
    e.preventDefault()
    const email = loginform.email.value
    const password = loginform.password.value
    signInWithEmailAndPassword(auth,email,password)
    .then((result)=>{
      alert("เข้าสู่บัญชีผู้ใช้เรียบร้อย")
    }).catch((error)=>{
      alert(error.message)
    })

  })

  onAuthStateChanged(auth,(user)=>{

    if(user){
      profile1.style.display="block"
      formarea1.style.display="none"
      welcome1.innerText=`ยินดีต้อนรับ${user.email}`
    }else{
      profile1.style.display="none"
      formarea1.style.display="block"
    }

  })

  logout1.addEventListener("click",(e)=>{
    signOut(auth).then(()=>{
      alert("ออกจากระบบเรียบร้อย")
    }).catch((error)=>{
      alert(error.message)
    })

  })
