import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, collection, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// กำหนดค่า Firebase
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
const db = getFirestore(app);
const auth = getAuth(app);

// Cloudinary configuration
const cloudName = 'ddafghhjl';  // ใส่ชื่อ Cloud ของคุณ
const uploadPreset = 'testupload';  // ใส่ชื่อ Upload Preset ที่เป็นแบบ Unsigned

// ดึงแท็กจาก Firestore
async function getTags() {
    const tagsRef = collection(db, "tags");
    const tagSnapshot = await getDocs(tagsRef);
    const tags = tagSnapshot.docs.map(doc => doc.data().name);
    return tags;
}

// ฟังก์ชันสำหรับอัปโหลดภาพไปยัง Cloudinary
async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    console.log('Cloudinary response:', data);  // เพิ่มการตรวจสอบการตอบกลับจาก Cloudinary

    if (data.secure_url) {
        return data.secure_url;  // ส่งคืน URL ของภาพที่อัปโหลด
    } else {
        throw new Error('Error uploading image');
    }
}

// ฟังก์ชันสำหรับบันทึกชุดใน Firestore
async function saveCostumeToFirestore(costumeData) {
    const costumeRef = doc(collection(db, "costumes"));
    await setDoc(costumeRef, costumeData);
}
const uploadButton = document.getElementById('uploadButton'); // ปุ่มอัปโหลด
// ฟังก์ชันอัปโหลดชุด
const uploadForm = document.getElementById('uploadCostumeForm');
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("Submit event triggered");
    uploadButton.disabled = true; // ปิดการใช้งานปุ่มทันทีที่กด
    const costumeName = document.getElementById('costumeName').value;
    const costumeTags = tags; // ใช้แท็กที่เก็บในตัวแปร tags
    const costumeDescription = document.getElementById('costumeDescription').value;
    const costumeImage = document.getElementById('costumeImage').files[0];

    // ตรวจสอบการกรอกข้อมูล
    if (!costumeName || costumeTags.length === 0 || !costumeImage) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        uploadButton.disabled = false; // เปิดปุ่มอีกครั้งถ้าข้อมูลไม่ครบ
        return;
    }

    try {
        // อัปโหลดภาพไปยัง Cloudinary
        const imageUrl = await uploadImageToCloudinary(costumeImage);
        document.getElementById('uploadedImage').src = imageUrl;  // แสดงภาพ

        // บันทึกข้อมูลชุดใน Firestore
        const user = auth.currentUser;
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนอัปโหลด");
            return;
        }

        const costumeData = {
            name: costumeName,
            description: costumeDescription, 
            tags: costumeTags,
            imageUrl: imageUrl,
            userId: user.uid
        };

        // บันทึกชุดใน Firestore
        await saveCostumeToFirestore(costumeData);

        // อัปโหลดแท็กใหม่ไปยัง Firestore (หากยังไม่เคยมี)
        costumeTags.forEach(async tag => {
            const tagRef = doc(db, "tags", tag);
            const tagDoc = await getDoc(tagRef);
            if (!tagDoc.exists()) {
                await setDoc(tagRef, { name: tag });
            }
        });

        alert("อัปโหลดชุดสำเร็จ");

        // แสดงปุ่ม "อัปโหลดเพิ่ม" และ "แก้ไขข้อมูล"
        document.getElementById('uploadMoreButton').style.display = 'block';
        document.getElementById('editCostumeButton').style.display = 'block';

        // ซ่อนปุ่มอัปโหลด
        uploadButton.style.display = 'none';

    } catch (error) {
        console.error("Error uploading costume:", error);
        alert("เกิดข้อผิดพลาดในการอัปโหลดชุด");
        uploadButton.disabled = false; // เปิดปุ่มอีกครั้งหากมีข้อผิดพลาด
    }
});

document.getElementById('uploadMoreButton').addEventListener('click', () => {
    location.reload(); // รีเฟรชหน้า
});

document.getElementById('editCostumeButton').addEventListener('click', () => {
    window.location.href = 'edit_costumes.html'; // ไปหน้าแก้ไขข้อมูล
});

// ตั้งค่าผู้ใช้ autocomplete สำหรับแท็ก
const costumeTagsInput = document.getElementById('costumeTags');
const tagContainer = document.getElementById('tagContainer');
let tags = [];

// ฟังก์ชัน autocomplete สำหรับแท็ก
async function setupAutocomplete() {
    const availableTags = await getTags();
    $(costumeTagsInput).autocomplete({
        source: availableTags, // ใช้แท็กที่ดึงจาก Firestore
        minLength: 1,
        select: function(event, ui) {
            addTag(ui.item.value);  // เพิ่มแท็กที่เลือก
            costumeTagsInput.value = '';  // เคลียร์ช่องกรอก
            return false;
        }
    });
}

// ฟังก์ชันสำหรับเพิ่มแท็ก
function addTag(tag) {
    if (tag.trim() === '') return;  // ไม่เพิ่มถ้าเป็นช่องว่าง
    if (!tags.includes(tag)) {
        tags.push(tag);
        updateTagContainer();
    }
}

// ฟังก์ชันเพื่อแสดงแท็กในบล็อก
function updateTagContainer() {
    tagContainer.innerHTML = ''; // เคลียร์เนื้อหาเก่า
    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `${tag}<span class="delete-btn" onclick="removeTag('${tag}')">&times;</span>`;
        tagContainer.appendChild(tagElement);
    });
}

// ฟังก์ชันสำหรับลบแท็ก
function removeTag(tagToRemove) {
    tags = tags.filter(tag => tag !== tagToRemove);
    updateTagContainer();
}

// ฟังก์ชันเมื่อกดปุ่ม Enter
costumeTagsInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && costumeTagsInput.value.trim() !== '') {
        event.preventDefault();  // หยุดการส่งฟอร์ม
        addTag(costumeTagsInput.value.trim());  // เพิ่มแท็ก
        costumeTagsInput.value = '';  // เคลียร์ช่องกรอก
    }
});

// เรียกใช้ autocomplete เมื่อโหลดหน้า
document.addEventListener("DOMContentLoaded", setupAutocomplete);

document.addEventListener("DOMContentLoaded", () => {
    uploadButton.disabled = false; 
});


window.removeTag = function(tagToRemove) {
    tags = tags.filter(tag => tag !== tagToRemove);
    updateTagContainer();
}