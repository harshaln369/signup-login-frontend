import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import AuthHOC from "../components/AuthHOC";

const Root = () => {
  const [name, setName] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };
  return (
    <AuthHOC setName={setName}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {name ? (
          <Typography variant="h4" sx={{ margin: "4rem" }}>
            Congratulations{" "}
            <span style={{ color: "blue", fontSize: "3rem", margin: "0.5rem" }}>
              {name}
            </span>{" "}
            you are logged in.
          </Typography>
        ) : (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <CircularProgress />
          </div>
        )}
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </AuthHOC>
  );
};

export default Root;
