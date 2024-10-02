import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { message, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiRequest } from "../../utils/api";
import { useModal } from "../../zustand/ModalStore";
import { useIdStore } from "../../zustand/IdStore";
import { CarModal } from "../../utils/CarModal";

function Cars(props) {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openCreateCarModal, openEditCarModal } = useModal();
  const { setCarId } = useIdStore();

  const fetchCars = async () => {
    setLoading(true);
    try {
      const fetchedCars = await apiRequest("cars");
      setCars(fetchedCars.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await apiRequest(`cars/${id}`, "Delete");
      message.success("Car deleted successfully!");
      fetchCars();
    } catch (error) {
      message.error("Failed to delete car");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query) => {
    if (query.length > 0) {
      const filteredData = cars.filter((f) =>
        f.brand.title.toLowerCase().includes(query.toLowerCase())
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

  useEffect(() => {
    fetchCars();
  }, []);

  const columns = [
    {
      title: "Brand",
      dataIndex: "brand",
      render: (text) => <p className="lg:text-base text-sm">{text.title}</p>,
    },
    {
      title: "Model",
      dataIndex: "model",
      render: (text) => <p className="lg:text-base text-sm">{text.name}</p>,
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (text) => <p className="lg:text-base text-sm">{text}</p>,
    },
    {
      title: "City",
      dataIndex: "city",
      render: (text) => <p className="lg:text-base text-sm">{text.name}</p>,
    },
    {
      title: "Action",
      dataIndex: "",
      render: (_, item) => (
        <div className="flex items-center gap-4">
          <div
            className="bg-blue-500 hover:bg-blue-400 text-white cursor-pointer py-1 lg:px-3 px-2 rounded-md lg:text-xl"
            onClick={() => {
              openEditCarModal();
              setCarId(item.id);
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
          onClick={openCreateCarModal}
        >
          Add cars
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
        onClick={openCreateCarModal}
      >
        Add cars
      </button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchQuery.length > 0 ? searchedData : cars}
        rowKey={"id"}
        scroll={{ x: 800 }}
      />
      <CarModal getApi={fetchCars} data={cars} />
    </>
  );
}

export default Cars;
