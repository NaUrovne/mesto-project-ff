import { putLike, deleteLike } from "./api";

export const createCard = ({
  cardTemplate,
  data,
  userId,
  showImgPopup,
  handleDeleteCard
}) => {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const cardImg = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImg.src = data.link;
  cardImg.alt = data.name;
  cardTitle.textContent = data.name;
  likeCount.textContent = data.likes.length;

  cardImg.addEventListener("click", showImgPopup);

  if (data.owner._id !== userId) {
    deleteButton.style.display = "none";
  } else {
    deleteButton.addEventListener("click", () => {
      handleDeleteCard(data._id, cardElement);
    });
  }

  if (data.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }
  likeButton.addEventListener("click", () => {
    if (likeButton.classList.contains("card__like-button_is-active")) {
      deleteLike(data._id)
        .then((updatedCard) => {
          likeButton.classList.remove("card__like-button_is-active");
          likeCount.textContent = updatedCard.likes.length;
        })
        .catch((err) => {
          console.error("Failed to remove like:", err);
        });
    } else {
      putLike(data._id)
        .then((updatedCard) => {
          likeButton.classList.add("card__like-button_is-active");
          likeCount.textContent = updatedCard.likes.length;
        })
        .catch((err) => {
          console.error("Failed to add like:", err);
        });
    }
  });
  return cardElement;
};
