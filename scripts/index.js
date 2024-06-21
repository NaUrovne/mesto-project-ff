// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: DOM узлы
const cardList = document.querySelector(".places__list");
// @todo: Функция создания карточки
function createCard(src, title, removeCallback) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__image").src = src;
  cardElement.querySelector(".card__title").textContent = title;
  cardElement.querySelector(".card__image").alt = 'Картинка города ' + title;
  deleteButton.addEventListener("click", removeCallback);

  return cardElement;
}  
// @todo: Функция удаления карточки
function removeCard(event) {
    event.target.closest('.card').remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach((card) => {
    const cardItem = createCard(card.link, card.name, removeCard);
    cardList.append(cardItem);
});