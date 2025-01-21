"use strict";

const items = document.querySelectorAll(".item");
const cart = document.querySelector(".cart");
const containers = document.querySelectorAll(".cart__container");
const btnPay = document.querySelector(".banner__checkout-button");

let current = null;
let offsetX = 0;
let offsetY = 0;
let lastTouchX = 0;
let lastTouchY = 0;
let zIndex = 1;
let count = 0;
let currentCartIndex = 0;

function revertItem(element) {
  element.style.left = "";
  element.style.top = "";
  element.style.position = "";
  element.style.pointerEvents = "";
  current = null;
}

function isPointInsideElement(x, y, el) {
  const rect = el.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function updateCart() {
  if (current.classList.contains("shelf__item")) {
    current.classList.remove("shelf__item");
    current.classList.add("cart__item");
  }
  const targetContainer = containers[currentCartIndex];
  targetContainer.appendChild(current);
  targetContainer.style.zIndex = zIndex++;
  revertItem(current);
  count++;
  currentCartIndex = (currentCartIndex + 1) % containers.length;
  if (count > 2) {
    btnPay.classList.add("_visible");
  }
}

function handleTouchStart(e) {
  e.preventDefault();
  current = this;

  const rect = current.getBoundingClientRect();
  const touch = e.touches[0];

  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;

  current.style.position = "fixed";
  current.style.zIndex = zIndex++;
  current.style.pointerEvents = "none";
  current.style.left = rect.left + "px";
  current.style.top = rect.top + "px";
}

function handleTouchMove(e) {
  if (!current) return;
  const touch = e.touches[0];
  lastTouchX = touch.clientX;
  lastTouchY = touch.clientY;
  current.style.left = touch.clientX - offsetX + "px";
  current.style.top = touch.clientY - offsetY + "px";
}

function handleTouchEnd() {
  if (!current) return;
  if (isPointInsideElement(lastTouchX, lastTouchY, cart)) {
    updateCart();
  } else {
    revertItem(current);
  }
}

function handleDragStart(e) {
  current = this;
  e.dataTransfer.setData("text/plain", "");
  e.dataTransfer.effectAllowed = "move";
}

function handleCartDragOver(e) {
  e.preventDefault();
}

function handleCartDrop() {
  if (!current || current.classList.contains("cart__item")) return;
  updateCart();
}

items.forEach((item) => {
  item.addEventListener("dragstart", handleDragStart);
  item.addEventListener("touchstart", handleTouchStart);
  item.addEventListener("touchmove", handleTouchMove);
  item.addEventListener("touchend", handleTouchEnd);
});

cart.addEventListener("dragover", handleCartDragOver);
cart.addEventListener("drop", handleCartDrop);

btnPay.addEventListener("click", () => {
  window.location.href = "https://lavka.yandex.ru/";
});
