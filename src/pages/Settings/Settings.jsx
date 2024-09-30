import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { message, Table } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  // SearchOutlined,
} from "@ant-design/icons";
import { apiRequest } from "../../utils/api";
import { useModal } from "../../zustand/ModalStore";
import { SettingModal } from "../../utils/SettingModal";
import { useIdStore } from "../../zustand/IdStore";

function Settings(props) {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const { openCreateCategoryModal, openEditCategoryModal } = useModal();
  const { setCategoryId } = useIdStore();

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await apiRequest("categories");
      setCategories(fetchedCategories.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`categories/${id}`, "Delete");
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const debouncedSearch = debounce((query) => {
    if (query.length > 0) {
      const filteredData = categories.filter((f) =>
        f.name_en.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filteredData);
    } else {
      setSearchedData([]);
    }
  }, 300);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
    // setShowError(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: "name_en",
      dataIndex: "name_en",
      // key: "name",
      render: (text) => <p className="lg:text-base text-sm">{text}</p>,
    },
    {
      title: "name_ru",
      dataIndex: "name_ru",
      // key: "name",
      render: (text) => <p className="lg:text-base text-sm">{text}</p>,
    },
    {
      title: "Image",
      dataIndex: "image_src",
      // key: "name",
      render: (src) => (
        <img
          src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${src}`}
          alt=""
          className="lg:h-16 h-10 lg:w-16 w-10 object-cover"
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      // key: "name",
      render: (_, item) => (
        <div className="flex items-center gap-4">
          <div
            className="bg-blue-500 hover:bg-blue-400 text-white cursor-pointer py-1 lg:px-3 px-2 rounded-md lg:text-xl"
            onClick={() => {
              openEditCategoryModal();
              setCategoryId(item.id);
            }}
          >
            <EditOutlined />
          </div>
          <div
            className="bg-rose-500 hover:bg-rose-400 text-white cursor-pointer py-1 lg:px-3 px-2 rounded-md lg:text-xl"
            onClick={() => handleDelete(item.id)}
          >
            <DeleteOutlined />
          </div>
        </div>
      ),
    },
    {
      title: (
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white lg:py-2 py-1 lg:px-4 px-2 rounded-md lg:text-base text-sm"
          onClick={openCreateCategoryModal}
        >
          Add categories
        </button>
      ),
      dataIndex: "key",
    },
  ];

  return (
    <>
      <div className="flex mb-10 overflow-hidden lg:w-1/3">
        <input
          type="search"
          placeholder="Search"
          className="text-sm w-full rounded-md outline-none lg:px-4 px-2 lg:py-2 py-1 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          onChange={handleSearchInput}
        />
      </div>
      {categories.length > 0 ? (
        <Table
          columns={columns}
          dataSource={searchQuery.length > 0 ? searchedData : categories}
          rowKey={"id"}
          className=""
          scroll={{ x: 800 }}
        />
      ) : (
        <p>Loading ...</p>
      )}
      <SettingModal getApi={fetchCategories} data={categories} />
    </>
  );
}

export default Settings;
