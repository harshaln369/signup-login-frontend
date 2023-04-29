import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import {
  validationSchemaLogin,
  validationSchemaSignup,
} from "../validations/authValidations";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";

const theme = createTheme();

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: isLogin ? validationSchemaLogin : validationSchemaSignup,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${BASE_URL}/auth/${isLogin ? "login" : "signup"}`,
          values
        );
        setLoading(false);
        if (data.status) {
          localStorage.setItem("token", data.data.token);
          navigate("/");
        } else {
          setLoading(false);
          setError(data.data.message);
        }
      } catch (error) {
        setLoading(false);
        setError(error.response.data.data.message);
      }
    },
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const errorTimeout = setTimeout(() => setError(false), 3000);

    return () => clearTimeout(errorTimeout);
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "Login" : "Sign up"}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {!isLogin && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    autoComplete="given-name"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  autoComplete="new-password"
                />
              </Grid>
              {!isLogin && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                  />
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {isLogin ? "Login" : "Sign Up"}
              {loading ? <CircularProgress size={20} /> : null}
            </Button>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Grid container justifyContent="flex-end">
              <Grid item>
                {isLogin ? (
                  <Link
                    onClick={() => {
                      setIsLogin(false);
                      formik.resetForm();
                    }}
                    variant="body2"
                    style={{ cursor: "pointer" }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                ) : (
                  <Link
                    onClick={() => {
                      setIsLogin(true);
                      formik.resetForm();
                    }}
                    variant="body2"
                    style={{ cursor: "pointer" }}
                  >
                    Already have an account? Sign in
                  </Link>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
