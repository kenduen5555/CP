async function fetchData() {
    try {
        const response = await fetch('data.json');
        return await response.json();
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
}

async function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (query === "") return; // ถ้าไม่มีคำค้นหา ไม่ต้องทำอะไร

    const items = await fetchData();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    const filteredItems = items.filter(item =>
        item.character.toLowerCase().includes(query) ||
        item.shop.toLowerCase().includes(query)
    );

    if (filteredItems.length === 0) {
        resultDiv.innerHTML = "<p>ไม่พบผลลัพธ์</p>";
    } else {
        filteredItems.forEach(item => {
            resultDiv.innerHTML += `
                <div>
                    <img src="${item.image}" width="100">
                    <p><b>${item.character}</b> จาก <i>${item.series}</i></p>
                    <p>ร้าน: <a href="${item.link}" target="_blank">${item.shop}</a></p>
                </div>
                <hr>
            `;
        });
    }
}
