import { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiRequest } from "./api";
import { useModal } from "../zustand/ModalStore";
import { useIdStore } from "../zustand/IdStore";

export function NewsModal({ getApi, data }) {
  const [titleUz, setTitleUz] = useState("");
  const [textUz, setTextUz] = useState("");
  const [author, setAuthor] = useState("");
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const imgRef = useRef(null);
  const [errors, setErrors] = useState({});
  const {
    isCreateModelOpen,
    isEditModelOpen,
    closeCreateModelModal,
    closeEditModelModal,
  } = useModal();
  const { newsId, setNewsId } = useIdStore();

  const item = data.find((el) => el.id === newsId);

  useEffect(() => {
    if (item) {
      setTitleUz(item.title_uz || "");
      setTextUz(item.text_uz || "");
      setAuthor(item.author || "");
      setImg(null);
      setImgPreview(null);
    }
  }, [item]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setImg(null);
    setImgPreview(null);
  };

  const formValidation = () => {
    const formErrors = {};

    if (!titleUz.trim()) {
      formErrors.titleUz = "Title is required";
    } else if (titleUz.length < 2 || titleUz.length > 50) {
      formErrors.titleUz = "Title must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(titleUz)) {
      formErrors.titleUz = "Title must contain only letters and spaces";
    }

    if (!textUz.trim()) {
      formErrors.textUz = "Text is required";
    } else if (textUz.length < 2 || textUz.length > 50) {
      formErrors.textUz = "Text must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(textUz)) {
      formErrors.textUz = "Text must contain only letters and spaces";
    }

    if (!author.trim()) {
      formErrors.author = "Author is required";
    } else if (author.length < 2 || author.length > 50) {
      formErrors.author = "Author must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(author)) {
      formErrors.author = "Author must contain only letters and spaces";
    }
    // if (!titleUz) formErrors.titleUz = "Title is required";
    // if (!textUz) formErrors.textUz = "Text is required";
    // if (!author) formErrors.author = "Author is required";

    if (!img) formErrors.img = "Image is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title_uz", titleUz);
      formData.append("text_uz", textUz);
      formData.append("author", author);
      formData.append("images", img);
      try {
        await apiRequest("news", "Post", formData);
        handleCloseModal();
        message.success("News added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add news");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title_uz", titleUz);
      formData.append("text_uz", textUz);
      formData.append("author", author);
      formData.append("images", img);
      try {
        await apiRequest(`news/${newsId}`, "Put", formData);
        handleCloseModal();
        message.success("News updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated news");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setTitleUz("");
    setTextUz("");
    setAuthor("");
    setImg(null);
    setImgPreview(null);
    setErrors("");
    closeEditModelModal();
    closeCreateModelModal();
    setNewsId("");
  };

  return (
    <div>
      <Modal
        titleUz=""
        open={newsId ? isEditModelOpen : isCreateModelOpen}
        onOk={newsId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {newsId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* Title Uz */}
          <label htmlFor="titleUz">* Title Uz</label>
          <input
            type="text"
            id="titleUz"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.titleUz ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setTitleUz(e.target.value)}
            value={titleUz}
          />
          {errors.titleUz && (
            <span className="text-red-500 text-sm">{errors.titleUz}</span>
          )}

          {/* Text Uz */}
          <label htmlFor="textUz">* Text Uz</label>
          <input
            type="text"
            id="textUz"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.textUz ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setTextUz(e.target.value)}
            value={textUz}
          />
          {errors.textUz && (
            <span className="text-red-500 text-sm">{errors.textUz}</span>
          )}

          {/* Author*/}
          <label htmlFor="author">* Author</label>
          <input
            type="text"
            id="author"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.author ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
          />
          {errors.author && (
            <span className="text-red-500 text-sm">{errors.author}</span>
          )}

          {/* Image Upload */}
          <label htmlFor="img">* Upload Image</label>
          <input
            ref={imgRef}
            type="file"
            id="img"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className={`border-2 rounded-lg py-2 px-4 hidden ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex gap-4">
            {imgPreview && ( // Display preview with icons
              <div className="relative border-2 border-dotted w-24 h-24 rounded-lg group">
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Overlay appears on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  {/* Preview icon */}
                  <EyeOutlined
                    onClick={() => setIsPreviewVisible(true)} // Open large preview modal
                    className="text-white cursor-pointer"
                  />
                  {/* Delete icon */}
                  <DeleteOutlined
                    onClick={handleImageDelete} // Remove image
                    className="text-white cursor-pointer"
                  />
                </div>
              </div>
            )}
            <div className="border-2 border-dotted w-24 h-24 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  imgRef?.current.click();
                }}
                className="bg-gray-200 w-full h-full rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
          {errors.img && (
            <span className="text-red-500 text-sm">{errors.img}</span>
          )}
        </form>
      </Modal>
      <Modal
        visible={isPreviewVisible}
        footer={null}
        onCancel={() => setIsPreviewVisible(false)}
        centered
      >
        <img
          src={imgPreview}
          alt="Preview"
          className="w-full h-full object-contain"
        />
      </Modal>
    </div>
  );
}
