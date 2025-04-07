import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqxJMhfeNGmXB-j143LN6uxsIYkmEiwLE",
    authDomain: "kkcos-d3a73.firebaseapp.com",
    projectId: "kkcos-d3a73",
    storageBucket: "kkcos-d3a73.appspot.com",
    messagingSenderId: "400952081714",
    appId: "1:400952081714:web:c5bc2b7127a2e4be666b2b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const costumeList = document.getElementById("costumeList");
const costumeTemplate = document.getElementById("costumeTemplate");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "login.html";
        return;
    }

    const q = query(collection(db, "costumes"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
        const data = docSnap.data();
        const card = costumeTemplate.content.cloneNode(true);

        const nameInput = card.querySelector(".costume-name");
        const tagsInput = card.querySelector(".costume-tags");
        const descriptionInput = card.querySelector(".costume-description");
        const linkInput = card.querySelector(".costume-link");
        const saveBtn = card.querySelector(".save-btn");
        const deleteBtn = card.querySelector(".delete-btn");
        const showImageBtn = card.querySelector(".show-image-btn");  // ปุ่มแสดงภาพ
        const imageUploadInput = card.querySelector(".image-upload-input"); // ป้อนภาพใหม่
        const editImageBtn = card.querySelector(".edit-image-btn");
        const imagePreview = card.querySelector(".image-preview"); // แสดงตัวอย่างภาพ

        const tagContainer = card.querySelector(".tag-container");

        nameInput.value = data.name || "";
        descriptionInput.value = data.description || "";
        linkInput.value = data.link || "";

        let tags = data.tags || [];

        // ฟังก์ชันสำหรับการอัปเดตการแสดงแท็ก
        function updateTagDisplay() {
            tagContainer.innerHTML = '';
            tags.forEach(tag => {
                const tagEl = document.createElement('div');
                tagEl.classList.add('tag');
                tagEl.innerHTML = `${tag}<span class="delete-btn" style="cursor:pointer">&times;</span>`;
                tagEl.querySelector('.delete-btn').onclick = () => {
                    tags = tags.filter(t => t !== tag);
                    updateTagDisplay();
                };
                tagContainer.appendChild(tagEl);
            });
        }

        updateTagDisplay();

        // ดึงรายการแท็กที่มีอยู่ใน Firestore
        const availableTags = (await getDocs(collection(db, "tags"))).docs.map(doc => doc.data().name);

        // ใช้ jQuery autocomplete สำหรับการกรอกแท็ก
        $(document).ready(function() {
            $(tagsInput).autocomplete({
                source: availableTags,
                minLength: 1,
                select: function(event, ui) {
                    if (!tags.includes(ui.item.value)) {
                        tags.push(ui.item.value);
                        updateTagDisplay();
                    }
                    tagsInput.value = '';  // ล้างช่องกรอกข้อมูลหลังจากเลือกแท็ก
                    return false;
                }
            });
        });

        tagsInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter" && tagsInput.value.trim()) {
                event.preventDefault();
                const newTag = tagsInput.value.trim();

                if (!tags.includes(newTag)) {
                    // เพิ่มแท็กลงใน tags ของชุด
                    tags.push(newTag);
                    updateTagDisplay();

                    // เพิ่มแท็กใหม่ใน collection "tags" (ถ้ายังไม่มี)
                    const tagRef = doc(db, "tags", newTag);
                    const tagDoc = await getDoc(tagRef);
                    if (!tagDoc.exists()) {
                        await setDoc(tagRef, { name: newTag });
                    }
                }
                tagsInput.value = '';  // ล้างช่องกรอกข้อมูล
            }
        });

        // เมื่อคลิกปุ่มแสดงภาพ
        showImageBtn.addEventListener("click", () => {
            const imageUrl = data.imageUrl || '';  // ใส่ URL ของภาพชุดจากฐานข้อมูล
            if (imageUrl) {
                const imageWindow = window.open("", "_blank");
                imageWindow.document.write(`<img src="${imageUrl}" alt="Costume Image" style="max-width: 100%; height: auto;">`);
            } else {
                alert("ไม่มีภาพสำหรับชุดนี้");
            }
        });

        editImageBtn.addEventListener("click", (event) => {
            event.preventDefault(); // ป้องกันการทำงานปกติ
            imageUploadInput.click(); // เปิด file picker เพื่อเลือกไฟล์
        });

        // เพิ่มฟังก์ชันสำหรับการอัปโหลดและอัปเดตภาพ
        imageUploadInput.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "testupload"); // ตั้งค่า Cloudinary Preset ที่ถูกต้อง

                // อัปโหลดภาพไปที่ Cloudinary
                const cloudName = "ddafghhjl"; // ชื่อ cloud ของคุณ
                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

                try {
                    const response = await fetch(cloudinaryUrl, {
                        method: "POST",
                        body: formData,
                    });

                    const result = await response.json();
                    const imageUrl = result.secure_url;
                    const NewdeleteToken = result.delete_token;

                    // อัปเดต Firestore ด้วย URL ของภาพ
                    await updateDoc(doc(db, "costumes", docSnap.id), {
                        imageUrl: imageUrl,
                    });
//ลบภาพเก่าด้วยdeleteTokenของเดิม  
const deleteTokenDoc = await getDoc(doc(db, "deleteTokens", docSnap.id));

// หากมี deleteToken และ deleteTokenDoc.exists() เป็นจริง
if (deleteTokenDoc.exists()) {
    const deleteToken = deleteTokenDoc.data().deleteToken;
    // 🔥 หากมี deleteToken ให้ส่งไปลบที่ Cloudinary
    if (deleteToken && deleteToken !== "" && deleteToken !== null) {
        const cloudName = "ddafghhjl"; // เปลี่ยนตามชื่อ cloud ของคุณ
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`;

        const response = await fetch(cloudinaryUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: deleteToken })
        });

        if (!response.ok) {
            throw new Error("ลบภาพใน Cloudinary ล้มเหลว");
        }
        alert("ลบชุดในฐานข้อมูลแล้ว");

    }
} else {
    alert("แก้ชุดโดยไม่ลบภาพเก่า");
}

                    // อัปเดตข้อมูล deleteToken ใน Firestore เป็นของใหม่
                    await updateDoc(doc(db, "deleteTokens", docSnap.id), {
                        deleteToken: NewdeleteToken,
                    });

                    alert("อัปโหลดและเปลี่ยนรูปภาพเรียบร้อยแล้ว");
                    // แสดงตัวอย่างภาพ
                    imagePreview.src = imageUrl;  // อัปเดต src ของภาพ
                    imagePreview.style.display = "block";  // แสดงภาพที่อัปโหลด
                } catch (error) {
                    console.error("เกิดข้อผิดพลาดในการอัปโหลดภาพ:", error);
                    alert("เกิดข้อผิดพลาดในการอัปโหลดภาพ");
                }
            }
        });

        saveBtn.addEventListener("click", async () => {
            const updatedName = nameInput.value.trim();
            const updatedDescription = descriptionInput.value.trim();
            const updatedLink = linkInput.value.trim();
            await updateDoc(doc(db, "costumes", docSnap.id), {
                name: updatedName,
                tags,
                description: updatedDescription,
                link: updatedLink
            });
            alert("บันทึกข้อมูลสำเร็จ");
        });

        deleteBtn.addEventListener("click", async () => {
            const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบชุดนี้?");
            if (!confirmDelete) return;
        
            // สร้าง reference สำหรับ deleteToken
            const deleteTokenRef = doc(db, "deleteTokens", docSnap.id); // ใช้ costumeId เป็น docId
        
            try {
                // ตรวจสอบว่าเอกสาร deleteToken มีอยู่หรือไม่
                const deleteTokenDoc = await getDoc(deleteTokenRef);

                // หากมี deleteToken และ deleteTokenDoc.exists() เป็นจริง
                if (deleteTokenDoc.exists()) {
                    const deleteToken = deleteTokenDoc.data().deleteToken;
                    // 🔥 หากมี deleteToken ให้ส่งไปลบที่ Cloudinary
                    if (deleteToken && deleteToken !== "" && deleteToken !== null) {
                        const cloudName = "ddafghhjl"; // เปลี่ยนตามชื่อ cloud ของคุณ
                        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`;
        
                        const response = await fetch(cloudinaryUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ token: deleteToken })
                        });
        
                        if (!response.ok) {
                            throw new Error("ลบภาพใน Cloudinary ล้มเหลว");
                        }
        
                        // 🔥 ลบข้อมูลใน deleteTokens
                        await deleteDoc(deleteTokenRef);  // ลบ deleteToken
                        // 🔥 ลบข้อมูลชุดใน Firestore
                        await deleteDoc(doc(db, "costumes", docSnap.id));
                        alert("ลบชุดและภาพเรียบร้อยแล้ว");
                        location.reload();
                    }
                } else {
                    // 🔥 ลบข้อมูลชุดใน Firestore
                    await deleteDoc(doc(db, "costumes", docSnap.id));
                    alert("ลบชุดและภาพเรียบร้อยแล้วโดยไม่ได้ลบในฐานข้อมูล");
                    location.reload();
                }
        
               
        
            } catch (error) {
                console.error("เกิดข้อผิดพลาดขณะลบ:", error);
                alert("เกิดข้อผิดพลาดขณะลบชุดหรือลบภาพ");
            }
        });

        costumeList.appendChild(card);
    });
});


