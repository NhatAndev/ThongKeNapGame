import { getData } from "./storage.js";

let getPaidHistory = Object.values(getData('game-paid-history') || []).reverse();

const perPage = 5;
let size = Math.ceil(getPaidHistory.length / perPage);

let start;
let end;
let currentPage = 1;

function pagination() {
    function onSlide(page) {
        return page;
    }

    function renderListPaidHistory() {
        start = (currentPage - 1) * perPage;
        end = start + perPage;
        let html = "";
        let currentPaidHistory = getPaidHistory.slice(start, end);
        document.querySelector('#paid-history').innerHTML = "";
        currentPaidHistory.forEach((el, i) =>
            html += renderTablePaidHistory(el, start + i + 1)
        )
        

        document.querySelector('#paid-history')
            .innerHTML = html;
    }


    document.querySelector('#slidePage').addEventListener('keydown', e => {
        if (e.key === "Enter") {
            document.querySelector('#slidePage').blur();
        }
    })

    let isValid = true;
    document.querySelector('#slidePage').addEventListener('input', () => {
        const inputValue = document.querySelector('#slidePage').value;
        const regex = /^\d{1,}$/;


        if(Number(inputValue) === 0 || !regex.test(inputValue))
        {
            document.querySelector('#chk-quantity')
                .innerHTML = `Số trang không hợp lệ!, số trang tối đa hiện tại là ${size} trang`; 
            isValid = false;
        }
        else
        {
            document.querySelector('#chk-quantity').innerHTML = "";
            isValid = true;
        }
    })

    document.querySelector('#slidePage').addEventListener('blur', () => {
        const inputValue = document.querySelector('#slidePage');
        currentPage = onSlide(Number(inputValue.value));

        if (currentPage <= 1)
        {
            document.querySelector('#btn-prev')
            .classList.add('disabled')
            document.querySelector('#btn-next')
            .classList.remove('disabled');
        }
        else if(currentPage >= size)
        {
            document.querySelector('#btn-next')
                .classList.add('disabled')
            document.querySelector('#btn-prev')
            .classList.remove('disabled')
        }
        else
        {
            document.querySelector('#btn-prev')
            .classList.remove('disabled')
            document.querySelector('#btn-next')
            .classList.remove('disabled');
        }

        if(!isValid) return;

        if (Number(inputValue.value) > size) {
            document.querySelector('#chk-quantity')
                .innerHTML = `Số trang không hợp lệ!, số trang tối đa hiện tại là ${size} trang`;
        }
        else {
            document.querySelector('#slidePage').blur();
            document.querySelector('#chk-quantity')
                .innerHTML = "";
            document.querySelector('#totalPage').innerHTML = `${currentPage}/${size}`
            renderListPaidHistory();
        }

    })
    document.querySelector('#totalPage').innerHTML = `${currentPage}/${size}`

    renderListPaidHistory();

    window.onSlide = onSlide;

    if(currentPage === 1)
    {
        document.querySelector('#btn-prev').classList.add('disabled');
    }
    

    document.querySelector('#btn-prev')
        .addEventListener('click', () => {

            currentPage = onSlide(currentPage - 1);
            document.querySelector('#totalPage').innerHTML = `${currentPage}/${size}`
            document.querySelector('#btn-prev').blur();

            if (currentPage === 1)
            {
                document.querySelector('#btn-prev')
                .classList.add('disabled')
            }
            else
            {
                
                document.querySelector('#btn-next')
                    .classList.remove('disabled')
            }
            document.querySelector('#slidePage').value = "";    
            renderListPaidHistory();
                    
        })

    document.querySelector('#btn-next')
        .addEventListener('click', () => {
            currentPage = onSlide(currentPage + 1);
            document.querySelector('#totalPage').innerHTML = `${currentPage}/${size}`
            document.querySelector('#btn-next').blur();
            renderListPaidHistory();

            
            if (currentPage === size)
            {
                document.querySelector('#btn-next')
                .classList.add('disabled')
            }
            else
            {
                document.querySelector('#btn-prev')
                .classList.remove('disabled');
            }
                
            
            document.querySelector('#slidePage').value = "";
        })
}

if (size > 0) {
    document.querySelector('#paid-header').innerHTML += `
        <th>STT</th>
        <th>Tên game</th>
        <th>Tên gói nạp</th>
        <th>Giá gói nạp</th>
        <th>Số lượng</th>
        <th>Thành tiền</th>
        <th>Ngày nạp</th>
        <th>Thời gian nạp</th>
    `

    document.querySelector('#pagination-bar').innerHTML += `
        <button id="btn-prev" class="col-3 btn btn-secondary " style="width: 100px">
            <i class="bi bi-caret-left-fill"></i>
        </button>
        <div id="slide" class="col-3 ms-1">
            <input type="tel" name="" id="slidePage" class="text-center form-control">
        </div>
        <button id="btn-next" class="col-3 ms-1 btn btn-secondary" style="width: 100px">
            <i class="bi bi-caret-right-fill"></i>
        </button>
        <span id="totalPage" class="d-flex justify-content-center"></span>
    `;
    pagination();
}
else
{
    document.querySelector('#null-notice').innerHTML += `
        <div class="fw-bold">
            <p class="text-danger">Không có đơn hàng nào</p>
            <p>Lịch sử đơn hàng của bạn sẽ nằm ở đây</p>
        </div>
        
    `;
}


function renderTablePaidHistory(data, index) {
    return `
        <tr>
            <td>${index}</td>
            <td>${data.gameName}</td>
            <td>${data.packName}</td>
            <td>${data.packPrice.toLocaleString(0)}đ</td>
            <td>${data.packQuantity}</td>
            <td>${(data.packQuantity * data.packPrice).toLocaleString(0)}đ</td>
            <td>${data.packDate} / ${data.packMonth} / ${data.packYear}</td>
            <td>${data.packHours}:${data.packMin}:${data.packSec}</td>
        </tr>
    `
}