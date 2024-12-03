
// function component() {
//     const element = document.createElement('div');
//
//     // Lodash, currently included via a script, is required for this line to work
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//
//     return element;
// }
//
// document.body.appendChild(component());

// собрать вебпаком весь калл в один бандл обфусицированный минифицированный и его закинуть в статику
var lastHitIdx      = 0;
var pageNumber      = 0;
const pageContentLen  = 10;



class HitData {
    x;y;r;isHit;exec_time;exec_data;
    constructor(x, y, r, isHit, exec_time, exec_data) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
        this.exec_time = exec_time;
        this.exec_data = exec_data;
    }


    get x() {
        return this.x;
    }

    get y() {
        return this.y;
    }

    get r() {
        return this.r;
    }

    get isHit() {
        return this.isHit;
    }

    get exec_time() {
        return this.exec_time;
    }

    get exec_data() {
        return this.exec_data;
    }
}

function addTableRow(hitObject) {
    const tableBody = document.querySelector("#resultTable tbody");
    const rowNumber = tableBody.rows.length + 1;
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${hitObject.idx + 1}</td>
        <td>${hitObject.x}</td>
        <td>${hitObject.y}</td>
        <td>${hitObject.r}</td>
        <td>${hitObject.isHit ? "Попадание" : "Не попал"}</td>
        <td>${hitObject.exec_time}</td>
        <td>${hitObject.exec_data}</td>
    `;

    tableBody.appendChild(newRow);
}

function getAllContent() {
    const content = [];

    for (let i = 0; i < localStorage.length; i++) {
        const hitObject = JSON.parse(localStorage.getItem(i));

        if (hitObject === null) return content;

        hitObject.idx = i;
        content.push(hitObject);
    }

    return content;
}

function getPageContent(pageNum) {
    const content = [];

    for (let i = 0; i < pageContentLen; i++) {
        const hitObject = JSON.parse(localStorage.getItem(pageNum * pageContentLen + i));
        if (hitObject === null) return content;
        hitObject.idx = pageNum * pageContentLen + i;
        content.push(hitObject);
    }

    return content;
}

function setTableContent(pageNum) {
    if (pageNum < 0) return;
    if (lastHitIdx === 0) return;

    const tableBody = document.querySelector("#resultTable tbody");
    tableBody.innerHTML = ''; // clear table

    const content = getPageContent(pageNum);
    for (let i = content.length - 1; i >= 0; i--)
        addTableRow(content[i]);
    // content.forEach((hitObject) => addTableRow(hitObject));
}

// function addToStorage(hitObject) {
//     localStorage.setItem(lastHitIdx.toString(), JSON.stringify(hitObject));
//     lastHitIdx++;
// }

function isActualElement(elementIndex) {
    if (elementIndex < lastHitIdx) return;
    const pageLowerBound = pageNumber * pageContentLen;
    return pageLowerBound <= elementIndex && elementIndex < pageLowerBound + pageContentLen;
}

function nextPage() {
    if (lastHitIdx < (pageNumber + 1) * pageContentLen) return;
    setTableContent(++pageNumber);
    document.getElementById('pageNum').innerText = pageNumber + 1;
}

function prevPage() {
    if (pageNumber === 0) return;
    setTableContent(--pageNumber);
    document.getElementById('pageNum').innerText = pageNumber + 1;
}

function testAddElement() {
    const hitObject = new HitData(1, 2, 3, true, 0.1, "2021-10-10");
    const isActual = isActualElement(lastHitIdx);
    console.log(isActual)
    if (isActual) {
        addToStorage(hitObject);
        setTableContent(pageNumber);
        return;
    }
    pageNumber++;
    addToStorage(hitObject);
    setTableContent(pageNumber);
    document.getElementById('pageNum').innerText = pageNumber + 1;

}

$(document).ready(function () {
    lastHitIdx = localStorage.length;
    setTableContent(0);

    $('#x-buttons button').on('click', function () {
        const value = $(this).data('value');
        $('#x').val(value);
        $('#x-buttons button').removeClass('active');
        $(this).addClass('active');
    });

    $('#r-buttons button').on('click', function () {
        const value = $(this).data('value');
        sessionStorage.setItem("plotParameterR", value);

        drawCanvas(parseFloat(value));
        $('#r').val(value);
        $('#r-buttons button').removeClass('active');
        $(this).addClass('active');
    });

    $('.pagination-btn#prevPage').on('click', prevPage);
    $('.pagination-btn#nextPage').on('click', nextPage);
});

function drawCanvas(r) {

    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = 75;
    var R = scale * r; // Радиус R

    // Нарисуем фигуру
    drawShape(ctx, R);

    const dots = getAllContent();
    for (let i = 0 ; i < dots.length; i++) {
        const dot = dots[i];
        drawDot(ctx, {x: dot.x * scale + 250, y: (-1 * dot.y * scale) + 250})
    }

    canvas.onclick = (event) => {
        const rect = canvas.getBoundingClientRect();

        // page graph coordinates
        const graphDocumentX = event.clientX - rect.left;
        const graphDocumentY = event.clientY - rect.top;

        // x and y points on plot
        const x = graphDocumentX - 250;
        const y = -1 * (graphDocumentY  - 250);
        sendDot(x / R, y / R);
    };
}

function drawDot(ctx, dot) {
    if (dot.x < 0) dot.x = 0;
    if (dot.y < 0) dot.y = 0;

    if (dot.x > 500) dot.x = 500;
    if (dot.y > 500) dot.y = 500;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Функция для рисования фигуры
function drawShape(ctx, R) {
    const xCenter = 250;
    const yCenter = 250;
    ctx.fillStyle = '#4287f5';
    //Прямоугольник
    ctx.fillRect(xCenter, yCenter, R, R / 2);


    // Прямоугольный треугольник
    ctx.beginPath()
    ctx.moveTo(xCenter, yCenter);
    ctx.lineTo(xCenter - R, yCenter);
    ctx.lineTo(xCenter, yCenter + R);
    ctx.lineTo(xCenter, yCenter);
    ctx.fill();

    // Четверть круга
    ctx.beginPath();
    ctx.moveTo(xCenter, yCenter);
    ctx.arc(xCenter, yCenter, R / 2, -Math.PI / 2, 0, false);
    ctx.closePath();
    ctx.fill();

    // Оси
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Ось X
    ctx.beginPath();
    ctx.moveTo(0, yCenter);
    ctx.lineTo(xCenter * 2, yCenter);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(xCenter, 0);
    ctx.lineTo(xCenter, yCenter * 2);
    ctx.stroke();

    // Отметки на осях
    ctx.font = '15px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('-R', xCenter - R, yCenter + 15);
    ctx.fillText('-R/2', xCenter - R / 2, yCenter + 15);
    ctx.fillText('R/2', xCenter + R / 2, yCenter + 15);
    ctx.fillText('R', xCenter + R, yCenter + 15);
    ctx.fillText('-R', xCenter + 5, yCenter + R);
    ctx.fillText('-R/2', xCenter + 5, yCenter + R / 2);
    ctx.fillText('R/2', xCenter + 5, yCenter - R / 2);
    ctx.fillText('R', xCenter + 5, yCenter - R);
}