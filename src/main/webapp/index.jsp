<%@ page import="org.itmo.lab.model.Table" %>
<%@ page import="org.itmo.lab.model.Point" %>
<%@ page import="org.itmo.lab.model.TableRow" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лабораторная работа №1</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">

    <script src="script.js"></script>
</head>
<body>
<header>
    <div class="header-content">
        <div class="header-info">
            <p>Чельтер Тимур Владимирович</p>
            <p>413105</p>
        </div>
    </div>
</header>

<div class="main">
    <div class="block-section">
        <canvas id="myCanvas" width="500" height="500"></canvas>
    </div>
    <div class="block-section">
        <h1>Введите координаты и радиус</h1>
        <form id="coordinateForm" action="${pageContext.request.contextPath}/controller" method="post">
            <div class="input-group">
                <label for="x">Координата X:</label>
                <div class="coordinate-buttons" id="x-buttons">
                    <button type="button" data-value="-2">-2</button>
                    <button type="button" data-value="-1.5">-1.5</button>
                    <button type="button" data-value="-1">-1</button>
                    <button type="button" data-value="-0.5">-0.5</button>
                    <button type="button" data-value="0">0</button>
                    <button type="button" data-value="0.5">0.5</button>
                    <button type="button" data-value="1">1</button>
                    <button type="button" data-value="1.5">1.5</button>
                    <button type="button" data-value="2">2</button>
                </div>
                <input type="hidden" id="x" name="x">
            </div>

            <div class="input-group">
                <label for="y">Координата Y (от -3 до 3):</label>
                <input type="text" id="y" name="y" placeholder="Введите Y" min="-3" max="3" required>
            </div>

            <div class="input-group">
                <label for="r">Радиус R:</label>
                <div class="radius-buttons" id="r-buttons">
                    <button type="button" data-value="1">1</button>
                    <button type="button" data-value="1.5">1.5</button>
                    <button type="button" data-value="2">2</button>
                    <button type="button" data-value="2.5">2.5</button>
                    <button type="button" data-value="3">3</button>
                </div>
                <input type="hidden" id="r" name="r">
            </div>

            <button type="submit" class="submit-btn">Отправить</button>
        </form>
    </div>
    <div class="table-section block-section">
        <h2>Результаты</h2>
        <table id="resultTable">
            <thead>
            <tr>
                <th>Номер записи</th>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Попадание</th>
                <th>Exec time</th>
                <th>Exec date</th>
            </tr>
            </thead>
            <tbody>
            <%-- Записи будут добавляться сюда --%>
            </tbody>

        </table>
        <div class="pagination block-section">
            <button id="prevPage" class="pagination-btn">Назад</button>
            <span>Номер страницы: </span><span id="pageNum">1</span>
            <button id="nextPage" class="pagination-btn">Вперед</button>
        </div>
    </div>
</div>

<script>
    function sendDot(x, y) {
        const r = $("#r").val();

        const regex = /^[+-]?\d+(\.\d+)?$/;

        if (!regex.test(r)) {
            toastr.warning("R must be set.", "Input Error");
            return false;
        }

        x *= parseFloat(r);
        y *= parseFloat(r);

        console.log("dot sended");

        let success = true;
        $.ajax({
            url: "${pageContext.request.contextPath}/controller",
            type: "POST",
            data: {
                x: x,
                y: y,
                r: r
            },
            success: function (response) {
                window.location.reload();
            },
            error: function (e) {
                toastr.error("говнищеСерв дохлый")
                success = false;
            }
        });
        return success;
    }

    function setStorage() {
        <% Table storage = (Table) session.getAttribute("table"); %>
        <%
            if (storage != null) {
                for (int i = 0; i < storage.size(); i++) {
                    TableRow item = storage.getItem(i); %>
        localStorage.setItem(
            "<%=i%>",
            JSON.stringify({
                x: <%= item.getPoint().getX() %>,
                y: <%= item.getPoint().getY() %>,
                r: <%= item.getPoint().getR() %>,
                isHit: <%= item.isInArea() %>,
                exec_data: "<%= item.getExecDate() %>",
                exec_time: "<%= item.getExecTime() %>",
            })
        )
        <%}%>
        <%}%>
        lastHitIdx = <%= (storage != null) ?  storage.size() : 0 %>;
    }


    $(document).ready(() => {
        <% storage = (Table) session.getAttribute("table"); %>
        <% if (storage == null) {%>
            localStorage.clear();
        <%} else {%>
            setStorage();
            console.log(<%=storage.size()%>);
        <%}%>
        setTableContent(0);

        const r = sessionStorage.getItem("plotParameterR") ?? "1";
        drawCanvas(parseFloat(r));

        // set R onload if it exists
        $('#r-buttons button').filter((idx, button) => button.getAttribute('data-value') === r).addClass('active');
        $('#r').val(r);
    });

    function addLastToLocal() {
        <% if (storage != null) {%>

        <%TableRow item = storage.getItem(storage.size() - 1); %>
        localStorage.setItem(
            <%= storage.size() %>,
            JSON.stringify({
                x: <%= item.getPoint().getX() %>,
                y: <%= item.getPoint().getY() %>,
                r: <%= item.getPoint().getR() %>,
                isHit: <%= item.isInArea() %>,
                exec_data: <%= item.getExecDate() %>,
                exec_time: <%= item.getExecTime() %>,
            })
        );
        lastHitIdx++;
        <%}%>
    }

    $("#coordinateForm").on("submit", function (event) {
        const x = $("#x").val();
        const y = $("#y").val();
        const r = $("#r").val();

        const regex = /^[+-]?\d+(\.\d+)?$/;

        if (!regex.test(x) || !regex.test(y) || !regex.test(r)) {
            toastr.error("Input must be a valid value.", "Input Error");
            event.preventDefault();
            return;
        }

        if (parseFloat(y) < -3 || parseFloat(y) > 3) {
            event.preventDefault();
            toastr.error("Y must be between -3 and 3.", "Input Error");
            return;
        }
    });
</script>

<footer>
    <p>&copy; 2024. ITMO Web | Лабораторная работа №1.0 </p>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
</body>
</html>

