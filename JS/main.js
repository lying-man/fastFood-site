"use strict";

const btnCloseMenu = document.querySelector(".wrapper-nav .close");
const btnOpenMenu = document.querySelector(".burger-menu");
const menu = document.querySelector(".wrapper-nav");
const overlay = document.querySelector(".overlay");
const btnOpenModal = document.querySelector(".sign");
const btnCloseModal = document.querySelector(".modal .close");
const modal = document.querySelector(".modal");
const readMoreText = document.querySelector(".more-text");
const btnReadMoreText = document.querySelector(".about-content-btn");

const textareaEl = document.querySelector("textarea");
const inputs = [ textareaEl, ...document.querySelectorAll(".form-block-input input") ];
const btnSendForm = document.querySelector(".btn-send-contacts");
const defaultText = document.querySelector(".default-text");
const loadingContent = document.querySelector(".loading-content");
const loadingSuccess = document.querySelector(".loading-success");

//basket

const basketOpenBtns = document.querySelectorAll(".basket-header-btn");
const basketThumbIndicators = document.querySelectorAll(".basket-header-btn-thumb");
const basketCloseBtn = document.querySelector(".basket-header-close");
const basket = document.querySelector(".basket");
const swiperSlideList = document.querySelectorAll(".swiper-slide");
const basketContainer = document.querySelector(".basket-box");
const totalPriceCart = document.querySelector(".total-price");
const btnResetBasket = document.querySelector(".reset-basket");
const toster = document.querySelector(".toster");

basketOpenBtns.forEach(el => el.addEventListener("click", openBasket));
basketCloseBtn.addEventListener("click", closeBasket);
swiperSlideList.forEach(el => el.addEventListener("click", addFoodToCart));
basketContainer.addEventListener("click", basketContainerHandler);
btnResetBasket.addEventListener("click", resetBasket);

let orderCart = JSON.parse(localStorage.getItem("order")) || [];

//fill data
for (let el of swiperSlideList) {

    let titleEl = el.dataset.title;

    for (let data of orderCart) {
        if (data.title === titleEl) {
            let btn = el.querySelector(".card-footer-btn");
            toggleBtnCardActive(btn, "hide");
            displayCartItem(data, data.amount === 1);
        }
    }

}

countAllCartSum();
setThumbAmount();
if (!(orderCart.length)) basket.classList.add("empty");

function showToast() {
    if (!toster.classList.contains("active")) {
        toster.classList.add("active");
        setTimeout(() => toster.classList.remove("active"), 3000);
    }
}

function addFoodToCart(e) {

    if (e.target.matches(".card-footer-btn")) {

        let price = Number(this.dataset.price);
        let title = this.dataset.title;
        let src = this.dataset.img;
        let data = { title, price, amount: 1, srcImg: src, initialPrice: price };

        orderCart.push(data);
        basket.classList.remove("empty");
        saveOrderCart();
        countAllCartSum();

        let btn = this.querySelector(".card-footer-btn");

        toggleBtnCardActive(btn, "hide");
        displayCartItem(data, true);
        setThumbAmount();

        showToast();
    }

}

function setThumbAmount() {
    basketThumbIndicators.forEach(el => el.textContent = orderCart.length);
}

function resetBtnCartItem(title) {
    swiperSlideList.forEach((el) => {
        let titleEl = el.dataset.title;
        if (title === titleEl) {
            let btn = el.querySelector(".card-footer-btn");
            toggleBtnCardActive(btn, "show");
        }
    });
}

function resetBasket() {

    for (let el of swiperSlideList) {

        let dataTitle = el.dataset.title;

        for (let item of orderCart) {
            if (dataTitle === item.title) resetBtnCartItem(dataTitle);
        }

    }

    basketContainer.innerHTML = "<div class='empty-text'>Our product cart is empty</div>";
    basket.classList.add("empty");
    orderCart = [];
    saveOrderCart();
    countAllCartSum();
    setThumbAmount();

}

function basketContainerHandler(e) {

    if (e.target.matches(".btn-delete-item")) {
        let cartItem = e.target.closest(".basket-box-item");
        let title = cartItem.dataset.title;
        orderCart = orderCart.filter(el => el.title !== title);
        resetBtnCartItem(title);
        saveOrderCart();
        countAllCartSum();
        cartItem.remove();
        setThumbAmount();

        if (!orderCart.length) {
            basket.classList.add("empty");
        }

        return;
    }

    if (e.target.matches(".counter-inc")) {
        let cartItem = e.target.closest(".basket-box-item");
        let counterDec = cartItem.querySelector(".counter-dec");
        let title = cartItem.dataset.title;
        let price = cartItem.dataset.price;

        let newPrice = null;
        let newAmount = null;

        orderCart = orderCart.map((item) => {
            if (item.title === title) {
                newAmount = item.amount + 1;
                newPrice = item.price + Number(item.initialPrice);
                return { ...item, price: newPrice, amount: newAmount };
            }
            return item;
        });

        toggleCounterClickable(counterDec, "show");
        countAllCartSum();
        saveOrderCart();

        let priceEl = cartItem.querySelector(".busket-item-price");
        let counterEl = cartItem.querySelector(".counter-display");

        priceEl.textContent = "$" + newPrice;
        counterEl.textContent = newAmount;

        return;
    }

    if (e.target.matches(".counter-dec")) {
        let cartItem = e.target.closest(".basket-box-item");
        let title = cartItem.dataset.title;
        let price = cartItem.dataset.price;

        let newPrice = null;
        let newAmount = null;

        orderCart = orderCart.map((item) => {
            if (item.title === title) {
                newAmount = item.amount - 1;
                newPrice = item.price - Number(item.initialPrice);
                return { ...item, price: newPrice, amount: newAmount };
            }
            return item;
        });

        countAllCartSum();
        saveOrderCart();

        if (newAmount === 1) toggleCounterClickable(e.target, "hide");

        let priceEl = cartItem.querySelector(".busket-item-price");
        let counterEl = cartItem.querySelector(".counter-display");

        priceEl.textContent = "$" + newPrice;
        counterEl.textContent = newAmount;

        return;
    }

}

function toggleCounterClickable(el, status) {

    if (status === "show") {
        el.classList.remove("disable");
        el.removeAttribute("disabled");
    } else {
        el.classList.add("disable");
        el.setAttribute("disabled", "");
    }

}

function countAllCartSum() {
    totalPriceCart.textContent = "$" + orderCart.reduce((val, el) => val += Number(el.price), 0); 
}

function displayCartItem(data, isActiveDec) {

    let item = `
        <div class="basket-box-item" data-title="${data.title}" data-price="${data.initialPrice}">
            <div class="item-info">
                <img class="item-info-img" src="${data.srcImg}" alt="basket image" />
                <div class="item-info-content">
                    <div class="title-basket-item">${data.title}</div> 
                    <div class="busket-item-price">$${data.price}</div>
                    <button class="btn-delete-item">Delete</button>
                </div>
            </div>
            <div class="counter">
                <button class="counter-btn counter-inc">+</button>
                <div class="counter-display">${data.amount}</div>
                <button class="counter-btn counter-dec ${ isActiveDec ? "disable" : "" }" ${ isActiveDec ? "disable" : "" }>-</button>
            </div>
        </div>
    `;

    basketContainer.insertAdjacentHTML("beforeend", item);

}


function toggleBtnCardActive(el, status) {
    if (status === "show") {
        el.classList.remove("disable")
        el.removeAttribute("disabled");
        el.textContent = "Buy now";
    } else {
        el.classList.add("disable")
        el.setAttribute("disabled", "");
        el.textContent = "In cart";
    }
}

function saveOrderCart() {
    let data = JSON.stringify(orderCart);
    localStorage.setItem("order", data);
}

function openBasket() { 
    overlay.classList.add("active");
    basket.classList.add("open");
    setPanelVisibility("show");
}

function closeBasket() { 
    overlay.classList.remove("active");
    basket.classList.remove("open");
    setTimeout(() => setPanelVisibility("hide"), 300);
}

//basket

//spoiler

const spoilerBtns = document.querySelectorAll(".footer-links-title");
const isSpoilerActive = getComputedStyle(spoilerBtns[0].children[1]).display === "block";

if (isSpoilerActive) {

    spoilerBtns.forEach(el => {

        el.addEventListener("click", () => {

            if (el.classList.contains("open")) {
                el.nextElementSibling.style.maxHeight = "0px";
                el.children[1].classList.remove("open");
                el.classList.remove("open");
            } else {
                el.nextElementSibling.style.maxHeight = el.nextElementSibling.scrollHeight + "px";
                el.children[1].classList.add("open");
                el.classList.add("open");
            }

        });

    });

    spoilerBtns.forEach(el => {
        let box = el.nextElementSibling;
        box.style.maxHeight = "0px";
    });

}

//spoiler

btnSendForm.addEventListener("click", launchSending);
inputs.forEach(el => el.addEventListener("focus", (e) => e.target.classList.remove("error")));

const sizePanel = window.innerWidth - document.documentElement.offsetWidth;
let isActiveReadMore = false;
readMoreText.style.maxHeight = "0px";

btnCloseMenu.addEventListener("click", () => setMenuVisibility("hide"));
btnOpenMenu.addEventListener("click", () => setMenuVisibility("show"));
overlay.addEventListener("click", removeActiveStates);

btnCloseModal.addEventListener("click", () => setModalVisibility("hide"));
btnOpenModal.addEventListener("click", () => setModalVisibility("show"));

btnReadMoreText.addEventListener("click", setVisibilityReadMore);

document.documentElement.addEventListener("keydown", followTab);

textareaEl.addEventListener("blur", (e) => {
    if (!e.target.value.trim()) {
        e.target.nextElementSibling.style.display = "";
    }
});

textareaEl.addEventListener("focus", (e) => e.target.nextElementSibling.style.display = "none");

function setFormClickable(status) {
    if (status) {
        btnSendForm.classList.remove("disabled");
        btnSendForm.removeAttribute("disabled");
        inputs.forEach(el => el.classList.remove("disabled"));
        inputs.forEach(el => el.removeAttribute("disabled"));
    } else {
        btnSendForm.classList.add("disabled");
        btnSendForm.setAttribute("disabled", "");
        inputs.forEach(el => el.classList.add("disabled"));
        inputs.forEach(el => el.setAttribute("disabled", ""));
    }
}

function launchSending(e) {

    e.preventDefault();

    if (!inputs.every(el => Boolean(el.value.trim()))) {
        inputs.forEach(el => {
            if (!el.value.trim()) {
                el.classList.add("error");
            }
        });
        return;
    }

    setFormClickable(false);
    defaultText.classList.remove("active");
    loadingContent.classList.add("active");
    setTimeout(() => {
        loadingContent.classList.remove("active");
        loadingSuccess.classList.add("active");
        setTimeout(() => {
            loadingSuccess.classList.remove("active");
            defaultText.classList.add("active");
            setFormClickable(true);
            inputs.forEach(el => el.value = "");
            textareaEl.nextElementSibling.style.display = "";
        }, 3000);
    }, 5000);
}

function setPanelVisibility(status) {
    if (status === "hide") {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    } else {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = sizePanel + "px";
    }
}

function setModalVisibility(status) {
    if (status === "hide") {
        modal.classList.remove("active");
        overlay.classList.remove("active");
        setTimeout(() => btnOpenModal.focus(), 50);
        setTimeout(() => setPanelVisibility("hide"), 200);
    } else {
        setPanelVisibility("show");
        menu.classList.remove("active");
        modal.classList.add("active");
        overlay.classList.add("active");
        setTimeout(() => btnCloseModal.focus(), 50);
    }
}

function setMenuVisibility(status) { 
    if (status === "show") {
        menu.classList.add("active");
        overlay.classList.add("active");
        setPanelVisibility("show");
    } else {
        menu.classList.remove("active");
        overlay.classList.remove("active");
        setPanelVisibility("hide");
    }
}

function removeActiveStates() {
    overlay.classList.remove("active");
    menu.classList.remove("active");
    basket.classList.remove("open");
    setTimeout(() => setPanelVisibility("hide"), 200);
    setModalVisibility("hide");
}

function followTab(e) {
    let code = e.code;
    
    if (code === "Tab") {
        let el = document.activeElement;
        let elType = el.dataset.type;
        if (elType === "last") { setTimeout(() => btnCloseModal.focus(), 5) }
    }
    
}

//swiper code
const swiper = new Swiper(".swiper", {
    spaceBetween: 40,
    slidesPerGroup: 1,
    slidesPerView: 1,
    allowTouchMove: false,
    autoHeight: true,
    navigation: {
        nextEl: '.sw-button-next',
        prevEl: '.sw-button-prev',
    },
    breakpoints: {
        540: { slidesPerView: 2, spaceBetween: 40 },
        960: { spaceBetween: 68, slidesPerView: 3 },
    }
});

function setVisibilityReadMore() {

    if (!isActiveReadMore) {
        readMoreText.style.maxHeight = readMoreText.scrollHeight + "px";
        readMoreText.classList.add("active");
        btnReadMoreText.textContent = "Read Less";
    } else {
        readMoreText.style.maxHeight = 0 + "px";
        readMoreText.classList.remove("active");
        btnReadMoreText.textContent = "Read More";
    }

    isActiveReadMore = !isActiveReadMore;

}

//hover effect
if (!(/Android|BlackBerry|iPhone|iPad|iPod|webOS/i.test(navigator.platform))) {
    const cardList = document.querySelectorAll(".card");
    function launchParallax() {

        for (let elem of cardList) {

            let img = elem.querySelector(".card-wrapper");
            
            elem.addEventListener("mousemove", (e) => parallax(e, img));
            elem.addEventListener("mouseleave", function (event) {
                img.style.transform = "";
            });
    
        }
    
    }
    
    function parallax(e, img) {
        let elem = e.currentTarget;
    
        let cordX = e.offsetX;
        let cordY = e.offsetY;
        let halfWidth = elem.offsetWidth / 2;
        let halfHeight = elem.offsetHeight / 2;
    
        let value = "";
    
        //for width
        if (cordX > halfWidth) {
            value += `-${(cordX - halfWidth) / 8}px, `;
        }
    
        if (cordX < halfWidth) {
            value += `${(halfWidth - cordX) / 8}px, `;
        }
    
        //for height
        if (cordY > halfHeight) {
            value += `-${(cordY - halfHeight) / 8}px`;
        }
    
        if (cordY < halfHeight) {
            value += `${(halfHeight - cordY) / 8}px`;
        }
    
        img.style.transform = `translate(${value})`;
    
    }
    
    launchParallax();
}




