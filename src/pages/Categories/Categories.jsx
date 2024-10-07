import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { message, Table } from "antd";
import { apiRequest } from "../../utils/api";
import { useModal } from "../../zustand/ModalStore";
import { CategoryModal } from "../../utils/CategoryModal";
import { useIdStore } from "../../zustand/IdStore";

function Categories(props) {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openCreateCategoryModal, openEditCategoryModal } = useModal();
  const { setCategoryId } = useIdStore();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await apiRequest("categories");
      setCategories(fetchedCategories.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await apiRequest(`categories/${id}`, "Delete");
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query) => {
    if (query.length > 0) {
      const filteredData = categories.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
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
  };

  const columns = [
    {
      title: "№",
      dataIndex: "",
      render: (_, data, index) => (
        <p className="lg:text-base text-sm">{index + 1}</p>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <p className="lg:text-base text-sm">{text}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => <p className="lg:text-base text-sm">{text}</p>,
    },
    {
      title: "Action",
      dataIndex: "",
      render: (_, item) => (
        <div className="flex items-center gap-4">
          <div
            className="bg-blue-500 hover:bg-blue-400 text-white cursor-pointer py-1 lg:px-3 px-2 rounded-md"
            onClick={() => {
              openEditCategoryModal();
              setCategoryId(item.id);
            }}
          >
            Edit
          </div>
          <div
            className="bg-rose-500 hover:bg-rose-400 text-white cursor-pointer py-1 lg:px-3 px-2 rounded-md"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </div>
        </div>
      ),
    },
    {
      title: (
        <button
          className="hidden lg:block bg-blue-500 hover:bg-blue-400 text-white lg:py-2 py-1 lg:px-4 px-2 rounded-md lg:text-base text-sm"
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
      <div className="flex lg:mb-10 overflow-hidden lg:w-1/3">
        <input
          type="search"
          placeholder="Search"
          className="text-sm w-full rounded-md outline-none lg:px-4 px-2 lg:py-2 py-1 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          onChange={handleSearchInput}
        />
      </div>
      <button
        className="lg:hidden my-4 bg-blue-500 hover:bg-blue-400 text-white lg:py-2 py-1 lg:px-4 px-2 rounded-md lg:text-base text-sm"
        onClick={openCreateCategoryModal}
      >
        Add categories
      </button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchQuery.length > 0 ? searchedData : categories}
        rowKey={"id"}
        expandable={false}
        scroll={{ x: 800 }}
      />
      <CategoryModal getApi={fetchCategories} data={categories} />
    </>
  );
}

export default Categories;
