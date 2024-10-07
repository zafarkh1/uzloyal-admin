import { useEffect, useState } from "react";
import { useModal } from "../zustand/ModalStore";
import { Modal, message } from "antd";
import { apiRequest } from "./api";
import { useIdStore } from "../zustand/IdStore";

export function FaqModal({ getApi, data }) {
  const [titleUz, setTitleUz] = useState("");
  const [textUz, setTextUz] = useState("");
  const [errors, setErrors] = useState({});
  const {
    isCreateBrandOpen,
    isEditBrandOpen,
    closeCreateBrandModal,
    closeEditBrandModal,
  } = useModal();
  const { faqId, setFaqId } = useIdStore();

  const item = data.find((el) => el.id === faqId);

  useEffect(() => {
    if (item) {
      setTitleUz(item.title_uz || "");
      setTextUz(item.title_uz || "");
    }
  }, [item]);

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
      formErrors.textUz = "Title is required";
    } else if (textUz.length < 2 || textUz.length > 50) {
      formErrors.textUz = "Title must be between 2 and 50 characters";
    } else if (!/^[\p{L}\s]+$/u.test(textUz)) {
      formErrors.textUz = "Title must contain only letters and spaces";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      const formData = new FormData();
      formData.append("title_uz", titleUz);
      formData.append("text_uz", textUz);

      try {
        await apiRequest("faqs", "Post", formData);
        handleCloseModal();
        message.success("Faq added successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to add faq");
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

      try {
        await apiRequest(`faqs/${faqId}`, "Put", formData);
        handleCloseModal();
        message.success("Faq updated successfully!");
        getApi();
      } catch (error) {
        message.error("Failed to updated faq");
      }
    } else {
      message.error("Please fix validation errors");
    }
  };

  const handleCloseModal = () => {
    setTitleUz("");
    setTextUz("");
    setErrors("");
    closeEditBrandModal();
    closeCreateBrandModal();
    setFaqId("");
  };

  return (
    <div>
      <Modal
        titleUz=""
        open={faqId ? isEditBrandOpen : isCreateBrandOpen}
        onOk={faqId ? handleUpdateSubmit : handleCreateSubmit}
        onCancel={handleCloseModal}
      >
        <h5 className="text-xl font-semibold text-center">
          {faqId ? "Edit item" : "Adding item"}
        </h5>
        <form className="flex flex-col gap-2 mt-4">
          {/* Title uz */}
          <label htmlFor="titleUz">* Title uz</label>
          <input
            type="text"
            id="titleUz"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setTitleUz(e.target.value)}
            value={titleUz}
          />
          {errors.titleUz && (
            <span className="text-red-500 text-sm">{errors.titleUz}</span>
          )}

          {/* Text uz */}
          <label htmlFor="textUz">* Text uz</label>
          <input
            type="text"
            id="textUz"
            className={`border-2 rounded-lg outline-none py-2 px-4 ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
            onChange={(e) => setTextUz(e.target.value)}
            value={textUz}
          />
          {errors.textUz && (
            <span className="text-red-500 text-sm">{errors.textUz}</span>
          )}
        </form>
      </Modal>
    </div>
  );
}
