import { useEffect, useRef, useState } from "react";
import { useModal } from "../zustand/ModalStore";
import { Modal, message } from "antd";
import { apiRequest } from "./api";
import { useIdStore } from "../zustand/IdStore";

export function CityModal({ getApi, data }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const imgRef = useRef(null);
  const {
    isCreateCityOpen,
    isEditCityOpen,
    closeCreateCityModal,
    closeEditCityModal,
  } = useModal();
  const { cityId, setCityId } = useIdStore();

  const item = data.find((el) => el.id === cityId);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setText(item.text || "");
      setImage(null);
    }
  }, [item]);

  const formValidation = () => {
    const formErrors = {};

    if (!name.trim()) {
      formErrors.name = "Name is required";
    } else if (name.length < 2 || name.length > 50) {
      formErrors.name = "Name must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(name)) {
      formErrors.name = "Name must contain only letters and spaces";
    }

    if (!text.trim()) {
      formErrors.text = "Text is required";
    } else if (text.length < 2 || text.length > 50) {
      formErrors.text = "Text must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(text)) {
      formErrors.text = "Text must contain only Cyrillic letters and spaces";
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
      formData.append("name", name);
      formData.append("text", text);
      formData.append("images", image);

      try {
        await apiRequest("cities", "Post", formData);
        handleCloseModal();
        message.success("City added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add city");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("text", text);
      formData.append("images", image);

      try {
        await apiRequest(`cities/${cityId}`, "Put", formData);
        handleCloseModal();
        message.success("City updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated city");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setName("");
    setText("");
    setImage(null);
    setErrors("");
    closeEditCityModal();
    closeCreateCityModal();
    setCityId("");
  };

  return (
    <div>
      <Modal
        title=""
        open={cityId ? isEditCityOpen : isCreateCityOpen}
        onOk={cityId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {cityId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* English Name */}
          <label htmlFor="name">* Name</label>
          <input
            type="text"
            id="name"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}

          {/* Text */}
          <label htmlFor="text">* Text</label>
          <textarea
            rows={4}
            cols={30}
            type="text"
            id="text"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.text ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          {errors.text && (
            <span className="text-red-500 text-sm">{errors.text}</span>
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
