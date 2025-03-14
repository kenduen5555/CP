// จัดการการลากแถบเลื่อน
const container = document.getElementById('horizontalScrollContainer');
const scrollWrapper = document.getElementById('scrollWrapper');

let isMouseDown = false;
let startX, scrollLeft;

container.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = scrollWrapper.scrollLeft;
    container.style.cursor = 'grabbing'; // เปลี่ยน cursor เป็น grabbing ขณะลาก
});

container.addEventListener('mouseleave', () => {
    isMouseDown = false;
    container.style.cursor = 'grab'; // เปลี่ยน cursor กลับเมื่อเลิกลาก
});

container.addEventListener('mouseup', () => {
    isMouseDown = false;
    container.style.cursor = 'grab'; // เปลี่ยน cursor กลับเมื่อเลิกลาก
});

container.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const moveX = e.pageX - container.offsetLeft;
    const distance = (moveX - startX);
    scrollWrapper.scrollLeft = scrollLeft - distance;
});
