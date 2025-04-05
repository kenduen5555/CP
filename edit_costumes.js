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
        const saveBtn = card.querySelector(".save-btn");
        const deleteBtn = card.querySelector(".delete-btn");
        const showImageBtn = card.querySelector(".show-image-btn");  // ปุ่มแสดงภาพ

        const tagContainer = card.querySelector(".tag-container");

        nameInput.value = data.name || "";
        descriptionInput.value = data.description || "";

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

        saveBtn.addEventListener("click", async () => {
            const updatedName = nameInput.value.trim();
            const updatedDescription = descriptionInput.value.trim();
            await updateDoc(doc(db, "costumes", docSnap.id), {
                name: updatedName,
                tags,
                description: updatedDescription
            });
            alert("บันทึกข้อมูลสำเร็จ");
        });

        deleteBtn.addEventListener("click", async () => {
            const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบชุดนี้?");
            if (confirmDelete) {
                await deleteDoc(doc(db, "costumes", docSnap.id));
                alert("ลบชุดเรียบร้อยแล้ว");
                location.reload();
            }
        });

        costumeList.appendChild(card);
    });
});
