// Функция создания карточки
export function createCard(
  cardTemplate,
  src,
  title,
  removeCallback,
  likeCallback,
  showImgCallback
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImg = cardElement.querySelector(".card__image");
  cardImg.src = src;
  cardImg.alt = "Картинка города " + title;
  cardElement.querySelector(".card__title").textContent = title;
  deleteButton.addEventListener("click", removeCallback);
  likeButton.addEventListener("click", likeCallback);
  cardImg.addEventListener("click", showImgCallback);
  return cardElement;
}
// Функция удаления карточки
export function removeCard(event) {
  event.target.closest(".card").remove();
}
// Функция лайка карточки
export function likeCard(event) {
  event.target.classList.toggle("card__like-button_is-active");
}
