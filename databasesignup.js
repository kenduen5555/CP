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

  form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const email = form.email.value
    const password = form.password.value
    createUserWithEmailAndPassword(auth,email,password)
    .then((result)=>{
      alert("สร้างบัญชีผู้ใช้สำเร็จ")
    }).catch((error)=>{
      alert(error.message)
    })

  })

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
      alert("ออกจากระบบเรียบร้อย")
    }).catch((error)=>{
      alert(error.message)
    })

  })
