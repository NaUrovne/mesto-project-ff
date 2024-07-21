export const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  },
];

// Функция создания карточки
export function createCard(
  cardTemplate,
  cardList,
  src,
  title,
  removeCallback,
  likeCallback,
  showImgCallback
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  cardElement.querySelector(".card__image").src = src;
  cardElement.querySelector(".card__title").textContent = title;
  cardElement.querySelector(".card__image").alt = "Картинка города " + title;
  deleteButton.addEventListener("click", removeCallback);
  likeButton.addEventListener("click", likeCallback);
  cardList.addEventListener("click", showImgCallback);
  return cardElement;
}
// Функция удаления карточки
export function removeCard(event) {
  event.target.closest(".card").remove();
}
// Функция лайка карточки
export function likeCard(event) {
  if (event.target.classList.contains("card__like-button")) {
    event.target.classList.toggle("card__like-button_is-active");
  }
}
