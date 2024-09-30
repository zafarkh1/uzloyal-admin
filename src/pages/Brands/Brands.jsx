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
import { useIdStore } from "../../zustand/IdStore";
import { BrandModal } from "../../utils/BrandModal";
// import { useBrandStore } from "../../zustand/BrandStore";

function Brands(props) {
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const { openCreateBrandModal, openEditBrandModal } = useModal();
  const { setBrandId } = useIdStore();

  const fetchBrands = async () => {
    try {
      const fetchedBrands = await apiRequest("brands");
      setBrands(fetchedBrands?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`brands/${id}`, "Delete");
      message.success("Brand deleted successfully!");
      fetchBrands();
    } catch (error) {
      message.error("Failed to delete brand");
    }
  };

  const debouncedSearch = debounce((query) => {
    if (query.length > 0) {
      const filteredData = brands.filter((f) =>
        f.title.toLowerCase().includes(query.toLowerCase())
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
    fetchBrands();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
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
          className="lg:h-16 h-10 lg:w-28 w-20 object-contain"
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
              openEditBrandModal();
              setBrandId(item.id);
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
          onClick={openCreateBrandModal}
        >
          Add brands
        </button>
      ),
      dataIndex: "key",
    },
  ];

  return (
    <>
      <div className="flex mb-10 overflow-hidden lg:w-1/3">
        {/* <button className="bg-gray-300 border-s lg:hover:bg-gray-300 lg:w-16 w-8 lg:h-10 h-8">
          <SearchOutlined className="" />
        </button> */}
        <input
          type="search"
          placeholder="Search"
          className="text-sm w-full rounded-md outline-none lg:px-4 px-2 lg:py-2 py-1 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          onChange={handleSearchInput}
        />
      </div>
      {brands.length > 0 ? (
        <Table
          columns={columns}
          dataSource={searchQuery.length > 0 ? searchedData : brands}
          rowKey={"id"}
          className=""
          scroll={{ x: 800 }}
        />
      ) : (
        <p>Loading ...</p>
      )}
      <BrandModal getApi={fetchBrands} data={brands} />
    </>
  );
}

export default Brands;
