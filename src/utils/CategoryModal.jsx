import { useEffect, useState } from "react";
import { useModal } from "../zustand/ModalStore";
import { Modal, message } from "antd";
import { apiRequest } from "./api";
import { useIdStore } from "../zustand/IdStore";

export function CategoryModal({ getApi, data }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
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
      setName(item.name || "");
      setDescription(item.description || "");
    }
  }, [item]);

  const formValidation = () => {
    const formErrors = {};

    if (!name.trim()) {
      formErrors.name = "Name is required";
    } else if (name.length < 2 || name.length > 50) {
      formErrors.name = "Name must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      formErrors.name = "Name must contain only letters and spaces";
    }

    if (!description.trim()) {
      formErrors.description = "Description is required";
    } else if (description.length < 2 || description.length > 50) {
      formErrors.description =
        "Description must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(description)) {
      formErrors.description =
        "Description must contain only letters and spaces";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
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
      formData.append("name", name);
      formData.append("description", description);

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
    setName("");
    setDescription("");
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
          {categoryId ? "Edit category" : "Adding category"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* Name */}
          <label htmlFor="name">* Name</label>
          <input
            type="text"
            id="name"
            className={`border-2 rounded-lg outline-none py-2 px-4 lg:text-base text-sm ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}

          {/* description */}
          <label htmlFor="desc">* Description</label>
          <input
            type="text"
            id="desc"
            className={`border-2 rounded-lg outline-none py-2 px-4 lg:text-base text-sm ${
              errors.description ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description}</span>
          )}
        </form>
      </Modal>
    </div>
  );
}
