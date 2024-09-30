import { useEffect, useRef, useState } from "react";
import { useModal } from "../zustand/ModalStore";
import { Modal, message } from "antd";
import { apiRequest } from "./api";
import { useIdStore } from "../zustand/IdStore";

export function BrandModal({ getApi, data }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const imgRef = useRef(null);
  const {
    isCreateBrandOpen,
    isEditBrandOpen,
    closeCreateBrandModal,
    closeEditBrandModal,
  } = useModal();
  const { brandId, setBrandId } = useIdStore();

  const item = data.find((el) => el.id === brandId);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setImage(null);
    }
  }, [item]);

  const formValidation = () => {
    const formErrors = {};

    if (!title.trim()) {
      formErrors.title = "Title is required";
    } else if (title.length < 2 || title.length > 50) {
      formErrors.title = "Title must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(title)) {
      formErrors.title = "Title must contain only letters and spaces";
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
      formData.append("title", title);
      formData.append("images", image);

      try {
        await apiRequest("brands", "Post", formData);
        handleCloseModal();
        message.success("Brands added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add brands");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("images", image);

      try {
        await apiRequest(`brands/${brandId}`, "Put", formData);
        handleCloseModal();
        message.success("Brands updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated brands");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setTitle("");
    setImage(null);
    setErrors("");
    closeEditBrandModal();
    closeCreateBrandModal();
    setBrandId("");
  };

  return (
    <div>
      <Modal
        title=""
        open={brandId ? isEditBrandOpen : isCreateBrandOpen}
        onOk={brandId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {brandId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* English Name */}
          <label htmlFor="title">* Title</label>
          <input
            type="text"
            id="title"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          {errors.brand && (
            <span className="text-red-500 text-sm">{errors.brand}</span>
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
