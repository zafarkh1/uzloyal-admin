import { useEffect, useRef, useState } from "react";
import { useModal } from "../zustand/Modal";
import { Modal, message } from "antd";
import { apiRequest } from "./api";
import { useIdStore } from "../zustand/IdStore";

export function SettingModal({ getApi, data }) {
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const imgRef = useRef(null);
  const {
    isCreateCategoryOpen,
    isEditCategoryOpen,
    closeCreateCategoryModal,
    closeEditCategoryModal,
  } = useModal();
  const { categoryId, setCategoryId } = useIdStore();

  const item = data.find((el) => el.id === categoryId);

  useEffect(() => {
    if (item) {
      setNameEn(item.name_en || "");
      setNameRu(item.name_ru || "");
      setImage(null);
    }
  }, [item]);

  const formValidation = () => {
    const formErrors = {};

    if (!nameEn.trim()) {
      formErrors.nameEn = "English name is required";
    } else if (nameEn.length < 2 || nameEn.length > 50) {
      formErrors.nameEn = "English name must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(nameEn)) {
      formErrors.nameEn = "English name must contain only letters and spaces";
    }

    if (!nameRu.trim()) {
      formErrors.nameRu = "Russian name is required";
    } else if (nameRu.length < 2 || nameRu.length > 50) {
      formErrors.nameRu = "Russian name must be between 2 and 50 characters";
    } else if (!/^[а-яА-ЯёЁ\s]+$/.test(nameRu)) {
      formErrors.nameRu =
        "Russian name must contain only Cyrillic letters and spaces";
    }

    if (!image) {
      formErrors.image = "Image is required";
    } else if (!["image/jpeg", "image/png", "image/jpg"].includes(image.type)) {
      formErrors.image = "Only .jpg, .jpeg, or .png files are allowed";
    } else if (image.size > 5 * 1024 * 1024) {
      formErrors.image = "Image size must be less than 5MB";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("name_en", nameEn);
      formData.append("name_ru", nameRu);
      formData.append("images", image);

      try {
        await apiRequest("categories", "Post", formData);
        handleCloseModal();
        message.success("Category added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add category");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("name_en", nameEn);
      formData.append("name_ru", nameRu);
      formData.append("images", image);

      try {
        await apiRequest(`categories/${categoryId}`, "Put", formData);
        handleCloseModal();
        message.success("Category updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated category");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setNameEn("");
    setNameRu("");
    setImage(null);
    setErrors("");
    closeEditCategoryModal();
    closeCreateCategoryModal();
    setCategoryId("");
  };

  return (
    <div>
      <Modal
        title=""
        open={categoryId ? isEditCategoryOpen : isCreateCategoryOpen}
        onOk={categoryId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {categoryId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* English Name */}
          <label htmlFor="name_en">* English Name</label>
          <input
            type="text"
            id="name_en"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.nameEn ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setNameEn(e.target.value)}
            value={nameEn}
          />
          {errors.nameEn && (
            <span className="text-red-500 text-sm">{errors.nameEn}</span>
          )}

          {/* Russian Name */}
          <label htmlFor="name_ru">* Russian Name</label>
          <input
            type="text"
            id="name_ru"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.nameRu ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setNameRu(e.target.value)}
            value={nameRu}
          />
          {errors.nameRu && (
            <span className="text-red-500 text-sm">{errors.nameRu}</span>
          )}

          {/* Image Upload */}
          <label htmlFor="image">* Upload Image</label>
          <input
            ref={imgRef}
            type="file"
            id="image"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setImage(e.target.files[0])}
            className={`border-2 rounded-lg py-2 px-4 hidden ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
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
          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image}</span>
          )}
        </form>
      </Modal>
    </div>
  );
}
