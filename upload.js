// Cloudinary JavaScript SDK เริ่มต้น
const cloudName = 'ddafghhjl';  // ใส่ชื่อ Cloud ของคุณ
const uploadPreset = 'testupload';  // ใส่ชื่อ Upload Preset ที่เป็นแบบ Unsigned

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];  // ดึงไฟล์จาก input

    if (!file) {
        alert('กรุณาเลือกไฟล์เพื่ออัปโหลด');
        return;
    }

    const fileSizeInMB = file.size / (1024 * 1024); // คำนวณขนาดไฟล์เป็น MB
    if (fileSizeInMB > 10) {
        alert("ขนาดไฟล์เกิน 10MB ไม่สามารถอัปโหลดได้!");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    // ทำการอัปโหลดไปยัง Cloudinary API
    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const imageUrl = data.secure_url; // ลิงก์ที่ Cloudinary ส่งกลับมา
        document.getElementById('imageUrl').innerText = imageUrl;  // แสดง URL ของภาพต้นฉบับ
        document.getElementById('uploadedImage').src = imageUrl;  // แสดงภาพต้นฉบับ

    })
    .catch(error => {
        console.error('Error uploading image:', error);
        alert('เกิดข้อผิดพลาดในการอัปโหลดภาพ');
    });
});
