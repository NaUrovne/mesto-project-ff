import "./pages/index.css";
import { createCard } from "./scripts/card.js";
import { openModal, closeModal } from "./scripts/modal.js";
import {
  enableValidation,
  clearValidation,
} from "./scripts/validation.js";
import {
  fetchUserProfile,
  fetchCards,
  fetchEditUserProfile,
  fetchAddNewCard,
  fetchUpdateAvatar,
  deleteCard,
} from "./scripts/api.js";

const popups = document.querySelectorAll('.popup')
popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup_opened')) {
      closeModal(popup)
    }
    if (evt.target.classList.contains('popup__close')) {
      closeModal(popup)
    }
  })
})

const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".places__list");

// функция добавления карточек 
function renderCard(item, method = "prepend") {
  const cardElement = createCard(item);
  cardList[ method ](cardElement);
}

// Функция для изменения текста кнопки
function renderLoading(
  isLoading,
  buttonElement,
  defaultText,
  loadingText = "Сохранение..."
) {
  if (isLoading) {
    buttonElement.textContent = loadingText;
  } else {
    buttonElement.textContent = defaultText;
  }
}

// Попап профиля
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfilePopup = document.querySelector(".popup_type_edit");

editProfileButton.addEventListener("click", () => {
  profileForm.elements.name.value = profileTitle.textContent;
  profileForm.elements.description.value = profileDesc.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(editProfilePopup);
});

// Попап добавления новой картинки
const openAddButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");

openAddButton.addEventListener("click", () => {
  imageForm.reset();
  clearValidation(imageForm, validationConfig);
  openModal(addCardPopup);
});

// Добавление новой картинки
const imageForm = document.forms["new-place"];
function addNewImage(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;

  renderLoading(true, submitButton, defaultText);

  const newImageTitle = imageForm.elements["place-name"].value;
  const newImageURL = imageForm.elements.link.value;
  fetchAddNewCard(newImageTitle, newImageURL)
    .then((addedCard) => {
      renderCard({
        cardTemplate: cardTemplate,
        data: addedCard,
        userId: userId,
        showImgPopup: showImgPopup,
        handleDeleteCard: handleDeleteCard
    });
      closeModal(addCardPopup);
      imageForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, defaultText);
    });
}
imageForm.addEventListener("submit", addNewImage);

// Открытие картинки в полный экран
const imgPopup = document.querySelector(".popup_type_image");
const zoomedPopupImg = imgPopup.querySelector(".popup__image");
const zoomedPopupCaption = imgPopup.querySelector(".popup__caption");

export function showImgPopup(evt) {
  if (evt.target.classList.contains("card__image")) {
    openModal(imgPopup);
    zoomedPopupImg.setAttribute("src", evt.target.src);
    zoomedPopupImg.setAttribute("alt", evt.target.alt);
    zoomedPopupCaption.textContent = evt.target.alt;
  }
}

let isDeleting = false;
function handleDeleteCard(cardId, cardElement) {
  if (isDeleting) return; // Предотвращение повторного клика во время выполнения запроса
  isDeleting = true;

  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(console.error)
    .finally(() => {
      isDeleting = false; // Разблокировка после завершения запроса
    });
}

// Редактирование профиля
const profileTitle = document.querySelector(".profile__title");
const profileDesc = document.querySelector(".profile__description");
const profileForm = document.forms["edit-profile"];
const nameInput = profileForm.elements.name;
const jobInput = profileForm.elements.description;
const profilePicture = document.querySelector(".profile__image");

function editProfileSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;

  renderLoading(true, submitButton, defaultText);
  fetchEditUserProfile(nameInput.value, jobInput.value)
    .then(() => {
      profileTitle.textContent = nameInput.value;
      profileDesc.textContent = jobInput.value;
      closeModal(editProfilePopup);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, defaultText);
    });
}
profileForm.addEventListener("submit", editProfileSubmit);

///Изменение картинки профиля
const avatarPopup = document.querySelector(".popup_type_change-avatar");
const avatarPicture = document.querySelector(".profile__image-container");
const avatarForm = document.forms["change-avatar"];
const avatarInput = avatarForm.elements.avatar;

avatarPicture.addEventListener("click", () => {
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

function changeAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;
  renderLoading(true, submitButton, defaultText);

  const avatarUrl = avatarInput.value;

  fetchUpdateAvatar(avatarUrl)
    .then((updatedUser) => {
      profilePicture.style.backgroundImage = `url(${updatedUser.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, defaultText);
    });
}
avatarForm.addEventListener("submit", changeAvatarSubmit);

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

let userId;
// Добавим все карточки из сервера
Promise.all([fetchUserProfile(), fetchCards()])
  .then(([userData, cardsData]) => {
    // Обработка данных пользователя
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDesc.textContent = userData.about;
    profilePicture.style.backgroundImage = `url(${userData.avatar})`;

    //Обработка данных карточек
    cardsData.forEach((cardData) => {
      renderCard({
        cardTemplate: cardTemplate,
        data: cardData,
        userId: userId,
        showImgPopup: showImgPopup,
        handleDeleteCard: handleDeleteCard
    }, 'append');
    });
  })
  .catch(console.error);
