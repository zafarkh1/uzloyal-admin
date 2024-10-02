import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Flex, Spin } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { apiRequest } from "../../utils/api";
import { useTokenStore } from "../../zustand/TokenStore";

function Login({ updateToken }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      setError("Please fill all the fields");
      return;
    }
    setLoading(true);

    try {
      const response = await apiRequest("auth/signin", "Post", {
        phone_number: phoneNumber,
        password: password,
      });

      if (response?.success) {
        setToken(response?.data?.tokens?.accessToken?.token);
        message.success("Logged in successfully");
        navigate("/");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center mx-8">
        <form
          className="bg-[#fafafa] lg:px-16 px-8 lg:py-20 py-16 rounded-lg shadow-lg lg:w-[25rem]"
          onSubmit={handleSubmit}
        >
          <div className="border-2 border-gray-400 px-3 py-4 bg-white mb-4 rounded-lg">
            <UserOutlined />
            <input
              type="text"
              placeholder="Phone number"
              className="ml-3 text-sm outline-none"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="border-2 border-gray-400 px-3 py-4 bg-white mb-4 rounded-lg">
            <LockOutlined />
            <input
              type="password"
              placeholder="Password"
              className="ml-3 text-sm outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <div className="text-center mt-12">
            <button className="bg-[#2f4574] w-full py-4 text-white rounded-lg text-sm">
              {loading ? "Logging in..." : "Submit"}
            </button>
          </div>
        </form>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black z-50 bg-opacity-50">
            <Flex align="center" gap="middle" className="absolute z-20">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </Flex>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
