import "./pages/index.css";
import { createCard } from "./scripts/card.js";
import { openModal, closeModal } from "./scripts/modal.js";
import {
  enableValidation,
  clearValidation,
  validationConfig,
} from "./scripts/validation.js";
import {
  fetchUserProfile,
  fetchCards,
  fetchEditUserProfile,
  fetchAddNewCard,
  fetchUpdateAvatar,
  deleteCard,
} from "./scripts/api.js";

const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".places__list");

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
const closeProfileButton = editProfilePopup.querySelector(".popup__close");

editProfileButton.addEventListener("click", () => {
  profileForm.elements.name.value = profileTitle.textContent;
  profileForm.elements.description.value = profileDesc.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(editProfilePopup);
});

closeProfileButton.addEventListener("click", () => {
  closeModal(editProfilePopup);
});

// Попап добавления новой картинки
const openAddButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const closeButton = addCardPopup.querySelector(".popup__close");

openAddButton.addEventListener("click", () => {
  imageForm.reset();
  clearValidation(imageForm, validationConfig);
  openModal(addCardPopup);
});
closeButton.addEventListener("click", () => {
  closeModal(addCardPopup);
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
      const cardElement = createCard(
        cardTemplate,
        addedCard,
        userId,
        showImgPopup,
        handleDeleteCard
      );
      cardList.prepend(cardElement);
      console.log("New card added", addedCard);
      closeModal(addCardPopup);
      imageForm.reset();
    })
    .catch((err) => {
      console.error("Failed to add new card:", err);
    })
    .finally(() => {
      renderLoading(false, submitButton, defaultText);
    });
}
imageForm.addEventListener("submit", addNewImage);

// Открытие картинки в полный экран
const imgPopup = document.querySelector(".popup_type_image");
const zoomedPopupImg = imgPopup.querySelector(".popup__image");
const zoomedPopupCaption = imgPopup.querySelector(".popup__caption");
const closeImageButton = imgPopup.querySelector(".popup__close");

closeImageButton.addEventListener("click", () => {
  closeModal(imgPopup);
});

export function showImgPopup(evt) {
  if (evt.target.classList.contains("card__image")) {
    openModal(imgPopup);
    zoomedPopupImg.setAttribute("src", evt.target.src);
    zoomedPopupImg.setAttribute("alt", evt.target.alt);
    zoomedPopupCaption.textContent = evt.target.alt;
  }
}

// Попап удаления картинки
const deletePopup = document.querySelector(".popup_type_confirm_delete");
const confirmDeleteButton = deletePopup.querySelector(".popup__button");
const closeDeletePopup = deletePopup.querySelector(".popup__close");

function handleDeleteCard(cardId, cardElement) {
  openModal(deletePopup);
  confirmDeleteButton.addEventListener("click", () => {
    deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        closeModal(deletePopup);
      })
      .catch((err) => {
        console.error("Failed to delete card:", err);
      });
  });
  closeDeletePopup.addEventListener("click", () => {
    closeModal(deletePopup);
  });
}

// Редактирование профиля
const profileTitle = document.querySelector(".profile__title");
const profileDesc = document.querySelector(".profile__description");
const profileForm = document.forms["edit-profile"];
const nameInput = profileForm.elements.name;
const jobInput = profileForm.elements.description;
const profilePicture = document.querySelector(".profile__image");
nameInput.value = profileTitle.textContent;
jobInput.value = profileDesc.textContent;

function editProfileSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;

  renderLoading(true, submitButton, defaultText);
  fetchEditUserProfile(nameInput.value, jobInput.value)
    .then((updatedUser) => {
      console.log("User profile updated:", updatedUser);
    })
    .catch((err) => {
      console.error("Failed to update user profile:", err);
    })
    .finally(() => {
      renderLoading(false, submitButton, defaultText);
    });

  profileTitle.textContent = nameInput.value;
  profileDesc.textContent = jobInput.value;
  closeModal(editProfilePopup);
}
profileForm.addEventListener("submit", editProfileSubmit);

///Изменение картинки профиля
const avatarPopup = document.querySelector(".popup_type_change-avatar");
const closeAvatarButton = avatarPopup.querySelector(".popup__close");
const avatarPicture = document.querySelector(".profile__image-container");
const avatarForm = document.forms["change-avatar"];
const avatarInput = avatarForm.elements.avatar;

avatarPicture.addEventListener("click", () => {
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

closeAvatarButton.addEventListener("click", () => {
  closeModal(avatarPopup);
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
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    })
    .finally(() => {
      renderLoading(false, submitButton, defaultText);
    });
}
avatarForm.addEventListener("submit", changeAvatarSubmit);

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
      const cardElement = createCard(
        cardTemplate,
        cardData,
        userId,
        showImgPopup,
        handleDeleteCard
      );
      cardList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });
