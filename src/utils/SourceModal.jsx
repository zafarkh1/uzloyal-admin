import { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiRequest } from "./api";
import { useModal } from "../zustand/ModalStore";
import { useIdStore } from "../zustand/IdStore";

export function SourceModal({ getApi, data }) {
  const [titleUz, setTitleUz] = useState("");
  const [img, setImg] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const imgRef = useRef(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const {
    isCreateCarOpen,
    isEditCarOpen,
    closeCreateCarModal,
    closeEditCarModal,
  } = useModal();
  const { sourceId, setSourceId } = useIdStore();

  const item = data.find((el) => el.id === sourceId);

  useEffect(() => {
    if (item) {
      setTitleUz(item.title || "");
      setImg(null);
      setImgPreview(null);
    }
  }, [item]);

  const fetchCategory = async () => {
    try {
      const fetchedCategories = await apiRequest("categories");
      setCategories(fetchedCategories?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

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

    // if (!titleUz) formErrors.titleUz = "Title is required";
    // if (!textUz) formErrors.textUz = "Text is required";
    // if (!author) formErrors.author = "Author is required";

    if (!categoryId) formErrors.category = "Brand is required";
    if (!img) formErrors.img = "Image is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title", titleUz);
      formData.append("category", categoryId);
      formData.append("images", img);
      try {
        await apiRequest("sources", "Post", formData);
        handleCloseModal();
        message.success("Service added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add service");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title", titleUz);
      formData.append("category", categoryId);
      formData.append("images", img);
      try {
        await apiRequest(`sources/${sourceId}`, "Put", formData);
        handleCloseModal();
        message.success("Service updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated service");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setTitleUz("");
    setImg(null);
    setImgPreview(null);
    setErrors("");
    closeEditCarModal();
    closeCreateCarModal();
    setSourceId("");
  };

  return (
    <div>
      <Modal
        titleUz=""
        open={sourceId ? isEditCarOpen : isCreateCarOpen}
        onOk={sourceId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {sourceId ? "Edit item" : "Adding item"}
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

          {/* Categories */}
          <label htmlFor="categories">* Categories</label>
          <select
            id="categories"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.textUz ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((category, index) => (
              <option value={category.id} key={index}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">{errors.category}</span>
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
