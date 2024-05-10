"use client"

import axios from 'axios';
import {
    createTheme,
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
    username: string;
    password: string;
};

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [authError, setAuthError] = useState("");
    const router = useRouter();

    const defaultTheme = createTheme();
    const onSubmit = (event: any): void => {
        const data: FormData = {
            username: event.username,
            password: event.password,
        };
        handleLogin(data);
    };

    const handleLogin = (data: FormData) => {
        axios
            .get("http://localhost:5001/login", {
                auth: {
                    username: data.username,
                    password: data.password
                }
            })
            .then((response) => {
                localStorage.setItem('isAuthenticated', 'true');
                router.push("/inventory/products");
            })
            .catch(function (error) {
                setAuthError("Incorrect user name or password.");
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
        <Container component="main">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {authError && (
                    <Typography variant="body2" color="error">
                        {authError}
                    </Typography>
                )}{" "}
                <TextField
                    type="text"
                    id="username"
                    variant="filled"
                    label="Username (Required)"
                    fullWidth
                    margin="normal"
                    {...register("username", { required: "Required input." }) }
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message?.toString() || ""}
                />
                <TextField
                    type="password"
                    id="password"
                    variant="filled"
                    label="Password (Required)"
                    autoComplete="current-password"
                    fullWidth
                    margin="normal"
                    {...register("password", {
                        required: "Required input.",
                        minLength: {
                        value: 6,
                        message: "Must be a string of at least 6 characters.",
                        },
                    })}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message?.toString() || ""}
                />
                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                >
                    Login
                </Button>
                </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
