import { request } from '../utils/request.js';

const config = {
  headers: {
    authorization: "fea76d02-5e37-41ed-8217-1ea64d8965df",
    "Content-Type": "application/json",
  },
};

export const fetchUserProfile = () => {
  return request(`/users/me`, config);
}

export const fetchCards = () => {
  return request(`/cards`, config);
}

export const fetchEditUserProfile = (name, about) => {
  return request(`/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({name, about}),
  });
};

export const fetchAddNewCard = (name, link) => {
  return request(`/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link
    }),
  });
};

export const deleteCard = (cardId) => {
  return request(`/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  })
};

export const putLike = (cardId) => {
  return request(`/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  });
};

export const deleteLike = (cardId) => {
  return request(`/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
};

export const fetchUpdateAvatar = (avatarUrl) => {
  return request(`/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl }),
  });
};
