import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { message, Table } from "antd";
import { apiRequest } from "../../utils/api";
import { useModal } from "../../zustand/ModalStore";
import { useIdStore } from "../../zustand/IdStore";
import { ServiceModal } from "../../utils/ServiceModal";

function Services(props) {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openCreateCarModal, openEditCarModal } = useModal();
  const { setServiceId } = useIdStore();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const fetchedServices = await apiRequest("services");
      setServices(fetchedServices.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(services);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await apiRequest(`services/${id}`, "Delete");
      message.success("Services deleted successfully!");
      fetchServices();
    } catch (error) {
      message.error("Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query) => {
    if (query.length > 0) {
      const filteredData = services.filter((f) =>
        f.title_uz.toLowerCase().includes(query.toLowerCase())
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
    fetchServices();
  }, []);

  const columns = [
    {
      title: "№",
      dataIndex: "",
      render: (_, data, index) => (
        <p className="lg:text-base text-sm">{index + 1}</p>
      ),
    },
    {
      title: "Image",
      dataIndex: "image_src",
      render: (src) => (
        <img
          src={`https://api.dezinfeksiyatashkent.uz/api/uploads/images/${src}`}
          alt="ee"
          className="lg:h-16 h-10 lg:w-16 w-10 object-cover"
        />
      ),
    },
    {
      title: "Title uz",
      dataIndex: "title_uz",
      render: (text) => <p className="lg:text-base text-sm">{text}</p>,
    },
    {
      title: "Text uz",
      dataIndex: "text_uz",
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
              openEditCarModal();
              setServiceId(item.id);
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
          onClick={openCreateCarModal}
        >
          Add services
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
        Add services
      </button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={searchQuery.length > 0 ? searchedData : services}
        rowKey={"id"}
        scroll={{ x: 800 }}
      />
      <ServiceModal getApi={fetchServices} data={services} />
    </>
  );
}

export default Services;
