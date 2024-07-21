import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, removeCard, likeCard } from "./scripts/card.js";
import { openModal, closeModal } from "./scripts/modal.js";
const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".places__list");

// Вывести карточки на страницу
initialCards.forEach((card) => {
  const cardItem = createCard(
    cardTemplate,
    card.link,
    card.name,
    removeCard,
    likeCard,
    showImgPopup
  );
  cardList.append(cardItem);
});

// ПОПАП ПРОФИЛЯ
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfilePopup = document.querySelector(".popup_type_edit");
const closeProfileButton = editProfilePopup.querySelector(".popup__close");

editProfileButton.addEventListener("click", () => {
  profileForm.elements.name.value = profileTitle.textContent;
  profileForm.elements.description.value = profileDesc.textContent;
  openModal(editProfilePopup);
});

closeProfileButton.addEventListener("click", () => {
  closeModal(editProfilePopup);
});

// ПОПАП ДОБАВЛЕНИЯ КАРТИНОК
const openAddButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const closeButton = addCardPopup.querySelector(".popup__close");

openAddButton.addEventListener("click", () => {
  imageForm.reset();
  openModal(addCardPopup);
});
closeButton.addEventListener("click", () => {
  closeModal(addCardPopup);
});

// открытие попапа картинки
const imgPopup = document.querySelector(".popup_type_image");
const zoomedPopupImg = imgPopup.querySelector(".popup__image");
const zoomedPopupCaption = imgPopup.querySelector(".popup__caption");
const closeImageButton = imgPopup.querySelector(".popup__close");

closeImageButton.addEventListener("click", () => {
  closeModal(imgPopup);
});

function showImgPopup(evt) {
  if (evt.target.classList.contains("card__image")) {
    openModal(imgPopup);
    zoomedPopupImg.setAttribute("src", evt.target.src);
    zoomedPopupImg.setAttribute("alt", evt.target.alt);
    zoomedPopupCaption.textContent = evt.target.alt;
  }
}

// редактирование профиля
const profileTitle = document.querySelector(".profile__title");
const profileDesc = document.querySelector(".profile__description");
const profileForm = document.forms["edit-profile"];
const nameInput = profileForm.elements.name;
const jobInput = profileForm.elements.description;
nameInput.value = profileTitle.textContent;
jobInput.value = profileDesc.textContent;

function editProfileSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDesc.textContent = jobInput.value;
  closeModal(editProfilePopup);
}
profileForm.addEventListener("submit", editProfileSubmit);

const imageForm = document.forms["new-place"];
function addNewImage(evt) {
  evt.preventDefault();
  const newImageTitle = imageForm.elements["place-name"].value;
  const newImageURL = imageForm.elements.link.value;
  const cardItem = createCard(
    cardTemplate,
    newImageURL,
    newImageTitle,
    removeCard,
    likeCard,
    showImgPopup
  );
  cardList.prepend(cardItem);
  closeModal(addCardPopup);
  imageForm.reset();
}
imageForm.addEventListener("submit", addNewImage);
