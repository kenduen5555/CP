document.addEventListener('DOMContentLoaded', function() {
    const displayName = localStorage.getItem("displayName");
    const loginLink = document.getElementById("login-link");
    const profileLink = document.getElementById("profile-link");

    if (displayName) {
        loginLink.style.display = "none";  // ซ่อนลิงค์เข้าสู่ระบบ
        profileLink.style.display = "block";  // แสดงลิงค์โปรไฟล์
    } else {
        loginLink.style.display = "block";  // แสดงลิงค์เข้าสู่ระบบ
        profileLink.style.display = "none";  // ซ่อนลิงค์โปรไฟล์
    }
});
