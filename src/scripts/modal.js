export function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeOnEscape);
  popup.addEventListener("mousedown", closeOnOverlay);
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
  popup.removeEventListener("mousedown", closeOnOverlay);
}

function closeOnOverlay(event) {
   if (event.target === event.currentTarget) {
     closeModal(event.currentTarget);
   }
}

function closeOnEscape(event) {
  if (event.key === "Escape") {
    closeModal(document.querySelector(".popup_is-opened"));
  }
}