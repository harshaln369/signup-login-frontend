import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";

export default function AuthHOC({ children, setName }) {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await axios.get(`${BASE_URL}/auth/notes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!data.status) {
            navigate("/auth");
            localStorage.removeItem("token");
          }
          setName(data.data.userDetails.name);
        } catch (error) {
          localStorage.removeItem("token");
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }
    };

    fetchData();
  }, []);
  return <>{children}</>;
}
