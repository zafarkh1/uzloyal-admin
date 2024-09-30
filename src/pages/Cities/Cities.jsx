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
import { CityModal } from "../../utils/CityModal";

function Cities(props) {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const { openCreateCityModal, openEditCityModal } = useModal();
  const { setCityId } = useIdStore();

  const fetchCities = async () => {
    try {
      const fetchedCities = await apiRequest("cities");
      setCities(fetchedCities.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`cities/${id}`, "Delete");
      message.success("City deleted successfully!");
      fetchCities();
    } catch (error) {
      message.error("Failed to delete city");
    }
  };

  const debouncedSearch = debounce((query) => {
    if (query.length > 0) {
      const filteredData = cities.filter((f) =>
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
    // setShowError(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "",
      render: (_, items, i) => <p>{i + 1}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      // key: "name",
      render: (text) => <p className="lg:text-base text-sm">{text}</p>,
    },
    {
      title: "Text",
      dataIndex: "text",
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
              openEditCityModal();
              setCityId(item.id);
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
          className="hidden lg:block bg-blue-500 hover:bg-blue-400 text-white lg:py-2 py-1 lg:px-4 px-2 rounded-md lg:text-base text-sm"
          onClick={openCreateCityModal}
        >
          Add cities
        </button>
      ),
      dataIndex: "key",
    },
  ];

  return (
    <>
      <div className="flex lg:mb-10 overflow-hidden lg:w-1/3">
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
      <button
        className="lg:hidden my-4 bg-blue-500 hover:bg-blue-400 text-white lg:py-2 py-1 lg:px-4 px-2 rounded-md lg:text-base text-sm"
        onClick={openCreateCityModal}
      >
        Add cities
      </button>
      {cities.length > 0 ? (
        <Table
          columns={columns}
          dataSource={searchQuery.length > 0 ? searchedData : cities}
          rowKey={"id"}
          className=""
          scroll={{ x: 800 }}
        />
      ) : (
        <p>Loading ...</p>
      )}
      <CityModal getApi={fetchCities} data={cities} />
    </>
  );
}

export default Cities;
