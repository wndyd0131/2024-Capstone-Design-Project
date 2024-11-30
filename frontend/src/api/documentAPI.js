import axiosInstance from "./axiosInstance";
import { API_DOCUMENT } from "@/constants/API";

export const postUploadDocument = (chatroom_id, files) => {
  return axiosInstance({
    url: API_DOCUMENT.UPLOAD_DOCUMENT(chatroom_id),
    method: "POST",
    data: { files }, //files array
  });
};

export const getMessage = (chatroom_id) => {
  return axiosInstance({
    url: API_DOCUMENT.GET_MESSAGE(chatroom_id),
    method: "GET",
  });
};

/* response
[
  {
    "document_id": 0,
    "document_name": "string",
    "uploaded_time": "2024-11-30T15:35:46.052Z"
  }
]
*/

export const deleteMessage = (chatroom_id, document_id) => {
  return axiosInstance({
    url: API_DOCUMENT.DELETE_MESSAGE(chatroom_id, document_id),
    method: "DELETE",
  });
};
