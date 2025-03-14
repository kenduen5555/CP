async function fetchData() {
    const response = await fetch('data.json');  // โหลดข้อมูลจาก JSON
    return await response.json();
}

async function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query === "") return; // ถ้าไม่มีคำค้นหา ไม่ต้องทำอะไร
    
    const items = await fetchData();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";  // เคลียร์ผลเก่าก่อนแสดงใหม่

    const filteredItems = items.filter(item => 
        item.character.toLowerCase().includes(query) || 
        item.series.toLowerCase().includes(query) || 
        item.shop.toLowerCase().includes(query)
    );

    if (filteredItems.length === 0) {
        resultDiv.innerHTML = "<p class='text-danger'>❌ ไม่พบผลลัพธ์</p>";
    }

    filteredItems.forEach(item => {
        const itemHTML = `
            <div class="card mt-3">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${item.image}" class="img-fluid rounded-start" alt="${item.character}">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <h5 class="card-title">${item.character} (${item.series})</h5>
                            <p class="card-text">ร้าน: <a href="${item.link}" target="_blank">${item.shop}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultDiv.innerHTML += itemHTML;
    });
}
