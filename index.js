import { saveMoney } from "./storage.js";
import { saveData } from "./storage.js";
import { getMoney } from "./storage.js";
import { getData } from "./storage.js";
import { clearForm } from "./storage.js";


/* 
nếu dùng lần đầu thì update trước, nếu không nó sẽ là NULL
*/
let dataUpdateWuwa = {
    priceMP: "",
    priceBP: "",
    priceVip: "",
    priceNormal: "",
    day: "15",
    month: "5",
    year: "2026"
}
let currentPriceWuwa = getData('updatePriceWuwa') ?? dataUpdateWuwa;

let dataUpdateNTE = {
    priceMP: "",
    priceBP: "",
    priceVip: "",
    price1mFons: "",
    day: "15",
    month: "5",
    year: "2026"
}
saveData('updatePriceNTE', dataUpdateNTE);

let currentPriceNTE = getData('updatePriceNTE');

// ========================================

function addDataPaidGame(dataGame) {
    let historyPaid = getData('game-paid-history') || [];
    // console.log(typeof getData('game-paid-history'));
    
    historyPaid.push(dataGame);
    return saveData('game-paid-history', historyPaid);
}

function showErrQuantity(errId, msg) {
    document.getElementById(errId).innerHTML = msg;
    return false;
}

function clearErrQuantity(errId) {
    document.getElementById(errId).innerHTML = "";
    return true;
}

function checkRegexQuantity(params) {
    const regexQuantity = /^\d{1,}$/;
    const inputValue = Number(params.value);
    if(!regexQuantity.test(inputValue) || inputValue <= 0) return false;
    return true;
}
let packPrice = 0;

function getPaidWuwa() {

    // init value

    let outputValue = 0;
    let totalMoney;
    
    /*
        dùng để lưu các giá trị sau khi nhập vào 
     */

    let dataPayWuwa = {
        "gameName": "Wuthering Waves",
        "packName": "",
        "packPrice": "",
        "packDate": "",
        "packMonth": "",
        "packYear": "",
        "packQuantity": "",
        "packHours": "",
        "packMin": "",
        "packSec": ""
    };


    document.getElementById('quantity-value').addEventListener('blur', validInputQuantity)
    function validInputQuantity() {
        let inputValue = document.getElementById('quantity-value');
        if (inputValue.value === "") return showErrQuantity('help-text-ww', 
            "không được để trống số lượng"
        );
        if(!checkRegexQuantity(inputValue)) return showErrQuantity('help-text-ww',
            "giá trị không hợp lệ, chỉ chấp nhận giá trị nhập vào là số, không được nhỏ hơn 0"
        )
        outputValue = Number(inputValue.value);
        dataPayWuwa.packQuantity = outputValue;
        return clearErrQuantity('help-text-ww');
    }

    document.querySelector('#slt-money-ww')
        .addEventListener('change', slGame => {
            switch (slGame.target.value) {
                case "mp-ww":
                    dataPayWuwa.packName = "Thẻ tháng";
                    packPrice = currentPriceWuwa.priceMP;
                    break;
                case "bp-ww":
                    dataPayWuwa.packName = "BP";
                    packPrice = currentPriceWuwa.priceBP;
                    break;
                case "15r":
                    dataPayWuwa.packName = "Gói 15 roll char";
                    packPrice = currentPriceWuwa.priceVip;
                    break;
                case "5r":
                    dataPayWuwa.packName = "Gói 5 roll char";
                    packPrice = currentPriceWuwa.priceNormal;
                    break;
            }
        })  
    document.getElementById('btn-save-ww')
        .addEventListener('click', () => {
            let originalMoneyWuwa = getMoney("ww") || 0;
            let isValid = true;
            if (!validInputQuantity()) isValid = false;
            const today = new Date();
            
            dataPayWuwa.packDate = today.getDate();
            dataPayWuwa.packMonth = today.getMonth() + 1;
            dataPayWuwa.packYear = today.getFullYear();
            dataPayWuwa.packHours = today.getHours();
            dataPayWuwa.packPrice = packPrice;
            dataPayWuwa.packMin = String(today.getMinutes()).padStart(2, "0");
            dataPayWuwa.packSec = String(today.getSeconds()).padStart(2, "0");

            if (!isValid) return;
            addDataPaidGame(dataPayWuwa);
            
            
            totalMoney = originalMoneyWuwa + packPrice * outputValue
            saveMoney('ww', totalMoney);
            
            document.getElementById('ww-game').innerHTML = `
            <p>
                Tổng nạp wuwa: ${getMoney('ww').toLocaleString(0)}
            </p>
        `;

            bootstrap.Modal.getOrCreateInstance(
                document.getElementById('modalId-ww')
            ).hide();
            clearForm('#form-paid-ww');
        })

    document.getElementById('ww-game')
        .innerHTML = `
        <p>
            Tổng nạp wuwa: ${getMoney("ww").toLocaleString(0)} đ
        </p>
    `;
}


getPaidWuwa();

function updatePriceWuwa() {

    
    drawUIUpdateWuwa(currentPriceWuwa);
    
    const getMpValue = document.getElementById('mp-ww-update');
    const getBpValue = document.getElementById('bp-ww-update');
    const getRollVipValue = document.getElementById('15r');
    const getRollNormalValue = document.getElementById('5r');
    const btnSaveUpdate = document.getElementById('btn-save-update--ww');

    function drawUIUpdateWuwa(data) {
        let uiUpdate = "";

        uiUpdate += `
            <tr>
                <td>
                    Thẻ tháng
                </td>
                <td>${data.priceMP.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
            <tr>
                <td>
                    Insider Channel
                </td>
                <td>${data.priceBP.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
            <tr>
                <td>
                    Gói 15 roll char
                </td>
                <td>${data.priceVip.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
            <tr>
                <td>
                    Gói 5 roll char
                </td>
                <td>${data.priceNormal.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
        `

        document.getElementById('ww-price').innerHTML = uiUpdate;
    }


    btnSaveUpdate.addEventListener('click', () => {

        const today = new Date();

        dataUpdateWuwa.day = today.getDate();
        dataUpdateWuwa.month = today.getMonth() + 1;
        dataUpdateWuwa.year = today.getFullYear();

        if(getMpValue.value === "" ||
            getBpValue.value === "" ||
            getRollVipValue.value === "" ||
            getRollNormalValue.value === ""
        ) return;
        dataUpdateWuwa.priceMP = Number(getMpValue.value);
        dataUpdateWuwa.priceBP = Number(getBpValue.value);
        dataUpdateWuwa.priceVip = Number(getRollVipValue.value);
        dataUpdateWuwa.priceNormal = Number(getRollNormalValue.value);


        saveData("updatePriceWuwa", dataUpdateWuwa);
        currentPriceWuwa = getData('updatePriceWuwa') || dataUpdateWuwa;

        drawUIUpdateWuwa(currentPriceWuwa);

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalIdUpdateWuwa')
        ).hide();
        clearForm('#form-update-ww');

    })

}

updatePriceWuwa();

function getPaidNTE() {

    let dataPayNTE = {
        "gameName": "NTE",
        "packName": "",
        "packPrice": "",
        "packDate": "",
        "packMonth": "",
        "packYear": "",
        "packQuantity": "",
        "packHours": "",
        "packMin": "",
        "packSec": ""
    }


    let packPrice = 0;
    let outputMoney;

    let sltMoneyNTE = document.querySelector('#slt-money-nte');
    sltMoneyNTE.addEventListener('change', slt => {
        switch (slt.target.value) {
            case "mp-nte":
                dataPayNTE.packName = "Thẻ tháng"
                packPrice = currentPriceNTE.priceMP;
                break;
            case 'bp-nte':
                dataPayNTE.packName = "Insider Channel"
                packPrice = currentPriceNTE.priceBP;
                break;
            case '10r':
                dataPayNTE.packName = "gói 10 roll banner"
                packPrice = currentPriceNTE.priceVip;
                break;
            case '1mfons':
                dataPayNTE.packName = "Gói 1m fons"
                packPrice = currentPriceNTE.price1mFons;
                break;
        }
    })

    document.getElementById('nte-quantity').addEventListener('blur', validInputQuantity);
    function validInputQuantity() {
        let inputValue = document.getElementById('nte-quantity');
        if (inputValue.value === "") return showErrQuantity('help-text-nte', 
            "không được để trống số lượng"
        );
        if(!checkRegexQuantity(inputValue)) return showErrQuantity('help-text-nte',
            "giá trị không hợp lệ, chỉ chấp nhận giá trị nhập vào là số, không được nhỏ hơn 0"
        )

        return clearErrQuantity('help-text-nte');
    }

    document.getElementById('btn-update-nte')
        .addEventListener('click', () => {
            let isValid = true;
            let origianlMoneyNTE = getMoney("nte");

            if (!validInputQuantity()) isValid = false;
            const today = new Date();
            
            outputMoney = origianlMoneyNTE + packPrice * (parseInt(document.getElementById('nte-quantity').value));
            dataPayNTE.packDate = today.getDate();
            dataPayNTE.packMonth = today.getMonth() + 1;
            dataPayNTE.packYear = today.getFullYear();
            dataPayNTE.packPrice = packPrice;
            dataPayNTE.packHours = today.getHours();
            dataPayNTE.packMin = String(today.getMinutes()).padStart(2, "0");
            dataPayNTE.packSec = String(today.getSeconds()).padStart(2, "0");
            dataPayNTE.packQuantity = (parseInt(document.getElementById('nte-quantity').value));

            if (!isValid) return;
            addDataPaidGame(dataPayNTE);


            saveMoney('nte', outputMoney);
            document.getElementById('nte-game').innerHTML = `
            <p>
                Tổng nạp NTE: ${getMoney('nte').toLocaleString(0)} đ
            </p>
        `;
            bootstrap.Modal.getOrCreateInstance(
                document.getElementById('modalId-nte')
            ).hide();
            clearForm('#form-paid-nte');
        });

    document.getElementById('nte-game').innerHTML = `
        <p>
            Tổng nạp NTE: ${getMoney('nte').toLocaleString(0)} đ
        </p>
    `;
}

getPaidNTE();

function updatePriceNTE() {

    const getMpValue = document.getElementById('mp-nte-update');
    const getBpValue = document.getElementById('bp-nte-update');
    const getRollVip = document.getElementById('10r');
    const get1mFons = document.getElementById('1mfons');
    const btnSaveUpdate = document.getElementById('btn-save-update--nte');

    
    drawUIUpdateNTE(currentPriceNTE);

    function drawUIUpdateNTE(data) {
        let uiUpdate = "";

        uiUpdate += `
            <tr>
                <td>
                    Thẻ tháng
                </td>
                <td>${data.priceMP.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
            <tr>
                <td>
                    Insider Channel
                </td>
                <td>${data.priceBP.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
            <tr>
                <td>
                    Gói 10 roll char
                </td>
                <td>${data.priceVip.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
            <tr>
                <td>
                    Gói 1m fons
                </td>
                <td>${data.price1mFons.toLocaleString(0)} đ</td>
                <td>${data.day} / ${data.month} / ${data.year}</td>
            </tr>
        `

        document.getElementById('nte-price').innerHTML = uiUpdate;
    }

    btnSaveUpdate.addEventListener('click', () => {
        if(getMpValue.value === "" ||
            getBpValue.value === "" ||
            getRollVip.value === ""
        ) return;
        const today = new Date();

        dataUpdateNTE.day = today.getDate();
        dataUpdateNTE.month = today.getMonth() + 1;
        dataUpdateNTE.year = today.getFullYear();
        dataUpdateNTE.priceMP = Number(getMpValue.value);
        dataUpdateNTE.priceBP = Number(getBpValue.value);
        dataUpdateNTE.priceVip = Number(getRollVip.value);
        dataUpdateNTE.price1mFons = Number(get1mFons.value);

        saveData('updatePriceNTE', dataUpdateNTE);
        currentPriceNTE = getData('updatePriceNTE') || dataUpdateNTE;
        drawUIUpdateNTE(currentPriceNTE);
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalIdUpdateNTE')
        ).hide();
        clearForm('#form-update-nte');
    })
}
updatePriceNTE();