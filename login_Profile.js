document.addEventListener('DOMContentLoaded', function() {
    const displayName = localStorage.getItem("displayName");
    const loginLink = document.getElementById("login-link");
    const loginLink2 = document.getElementById("login-link2");    
    const profileLink = document.getElementById("profile-link");
    const profileLink2 = document.getElementById("profile-link2");

    if (displayName) {
        loginLink.style.display = "none";  // ซ่อนลิงค์เข้าสู่ระบบ
        profileLink.style.display = "block";  // แสดงลิงค์โปรไฟล์
        loginLink2.style.display = "none";  
        profileLink2.style.display = "inline";  
    } else {
        loginLink.style.display = "block";  // แสดงลิงค์เข้าสู่ระบบ
        profileLink.style.display = "none";  // ซ่อนลิงค์โปรไฟล์
        loginLink2.style.display = "inline";  
        profileLink2.style.display = "none";  
    }
});


