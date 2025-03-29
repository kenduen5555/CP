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

/* window.onload = function() {
    const url = window.location.pathname;  // รับ URL ของหน้าเว็บปัจจุบัน (เช่น /For rent)

    // เปลี่ยน URL ในเบราว์เซอร์ให้ไม่มี .html
    const newUrl = url.replace('.html', '');  // ลบ .html ออกจาก URL
    history.pushState(null, null, newUrl);  // เปลี่ยน URL โดยไม่ต้องโหลดหน้าใหม่

    // โหลดเนื้อหาจาก URL ที่ไม่มี .html
    fetch(url + '.html')  // สมมติว่า URL ของไฟล์ HTML เป็น [url].html
        .then(response => response.text())  // ดึงเนื้อหาจากไฟล์ HTML
        .then(html => {
            document.getElementById('content').innerHTML = html;  // แสดงเนื้อหาที่โหลดใน #content
        })
        .catch(error => console.log("Error loading page: ", error));
}; */

// เมื่อโหลดหน้าเว็บ
window.onload = function() {
    const currentUrl = window.location.pathname; // รับ URL ปัจจุบัน
    const newUrl = currentUrl.replace('.html', ''); // ลบ .html ออกจาก URL

    // เปลี่ยน URL ในเบราว์เซอร์ให้ไม่มี .html
    if (currentUrl !== newUrl) {
        history.replaceState({ prevUrl: currentUrl }, null, newUrl); // ใช้ replaceState
    }

    // โหลดไฟล์ HTML ที่เกี่ยวข้อง
    loadPage(currentUrl);
};
