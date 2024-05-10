'use client'

import {
    Alert,
    AlertColor,
    Box,
    Button,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    Check as CheckIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';

type ProductData = {
    id: number | null;
    name: string;
    price: number;
    description: string;
};

function useRequireAuth(redirectUrl = '/login') {
    const router = useRouter();
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) {
            router.push(redirectUrl);
        }
    }, [router]);
}

export default function Page() {
    useRequireAuth();

    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        router.push('/login');
    };

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    } = useForm();

    // Holds read data
    const [data, setData] = useState<Array<ProductData>>([]);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<AlertColor>('success');
    const [message, setMessage] = useState('');
    const result = (severity: AlertColor, message: string) => {
        setOpen(true);
        setSeverity(severity);
        setMessage(message);
    };

    const handleClose = (event: any, reason: any) => {
        setOpen(false);
    };

    useEffect(() => {
        axios.get('/api/inventory/products')
            .then((res) => res.data)
            .then((data) => {
                setData(data)
        })
    }, [open])

    // Holds registration data
    const [id, setId] = useState<number | null>(0);
    // Branching action on submit
    const [action, setAction] = useState<string>("");
    const onSubmit = (event: any): void => {
        const data: ProductData = {
            id: id,
            name: event.name,
            price: Number(event.price),
            description: event.description,
        };
        // Switch HTTP methods and parameters to be used depending on action
        if (action === "add") {
            handleAdd(data);
        } else if (action === "update") {
            if (data.id === null) {
            return;
            }
            handleEdit(data);
            } else if (action === "delete") {
                if (data.id === null) {
                return;
            }
            handleDelete(data.id);
        }
    };

    // Registration process
    const handleShowNewRow = () => {
        setId(null);
        reset({
            name: "",
            price: "0",
            description: "",
        });
    };
    const handleAddCancel = () => {
        setId(0);
        };
    const handleAdd = (data: ProductData) => {
        axios.post("/api/inventory/products", data).then((response) => {
            result('success','The Product has been registered')
        });
        setId(0);
    };

    // Update and delete process
    const handleEditRow = (id: number | null) => {
    const selectedProduct: ProductData = data.find((v) => v.id === id) as ProductData;
    setId(selectedProduct.id);
    reset({
        name: selectedProduct.name,
        price: selectedProduct.price,
        description: selectedProduct.description,
        });
    };
    const handleEditCancel = () => {
        setId(0);
    };
    const handleEdit = (data: ProductData) => {
        axios.put(`/api/inventory/products/${data.id}`, data).then((response) => {
            result('success', 'The Product has been updated')
        });
        setId(0);
    };
    const handleDelete = (id: number) => {
        axios.delete(`/api/inventory/products/${id}`).then((response) => {
            result('success', 'The Product has been deleted')
        });
        setId(0);
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Products</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Link href="https://docs.google.com/document/d/1liY7OFoFqKqusu9JC6j6TSgvyt8FsfMQnpHxOxuKMaA/" passHref rel="noopener noreferrer" target="_blank">
                        <Button variant="contained" color="primary">Help</Button>
                    </Link>
                    <Button onClick={handleLogout} variant="contained" color="warning">Logout</Button>
                </Box>
            </Box>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleShowNewRow()}
            >
                Add Product
            </Button>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ height: 400, width: "100%" }}
            >
                <TableContainer component={Paper}>
                    <Table
                        sx={{
                            display: { mobile: "none", desktop: "table" },
                        }}
                    >

                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { id === null ? (
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>
                                    <TextField
                                        type="text"
                                        id="name"
                                        {...register("name", {
                                            required: "*Required input",
                                            maxLength: {
                                                value: 100,
                                                message: "Please enter a product name of up to 100 characters.",
                                            }
                                        })}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name?.message?.toString() || ""}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        id="price"
                                        {...register("price", {
                                        required: "*Required input",
                                        min: {
                                            value: 1,
                                            message: "Please enter a number between 1 and 9999999999.",
                                        },
                                        max: {
                                            value: 99999999,
                                            message: "Please enter a number between 1 and 9999999999.",
                                        },
                                        })}
                                        error={Boolean(errors.price)}
                                        helperText={errors.price?.message?.toString() || ""}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="text"
                                        id="description"
                                        {...register("description")}
                                    />
                                </TableCell>
                                {/* Added for routing */}
                                <TableCell></TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleAddCancel()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<CheckIcon />}
                                        onClick={() => setAction("add")}
                                    >
                                        Register
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ) : ""}
                        {data.map((data: any) => (
                            id === data.id ? (
                                <TableRow key={data.id}>
                                    <TableCell>{data.id}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="text"
                                            id="name"
                                            {...register("name", {
                                                required: "*Required input",
                                                maxLength: {
                                                    value: 100,
                                                    message: "Please enter a product name of up to 100 characters.",
                                                }
                                            })}
                                            error={Boolean(errors.name)}
                                            helperText={errors.name?.message?.toString() || ""}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            id="price"
                                            {...register("price", {
                                            required: "*Required input",
                                            min: {
                                                value: 1,
                                                message: "Please enter a number between 1 and 9999999999.",
                                            },
                                            max: {
                                                value: 99999999,
                                                message: "Please enter a number between 1 and 9999999999.",
                                            },
                                            })}
                                            error={Boolean(errors.price)}
                                            helperText={errors.price?.message?.toString() || ""}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="text"
                                            id="description"
                                            {...register("description")}
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <Button
                                              variant="outlined"
                                              startIcon={<CancelIcon />}
                                              onClick={() => handleEditCancel()}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<CheckIcon />}
                                            onClick={() => setAction("update")}
                                        >
                                            Update
                                        </Button>
                                        <IconButton
                                            aria-label="Delete"
                                            type="submit"
                                            color="warning"
                                            onClick={() => setAction("delete")}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={data.id}>
                                    <TableCell>{data.id}</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.price}</TableCell>
                                    <TableCell>{data.description}</TableCell>
                                    <TableCell><Link href={`/inventory/products/${data.id}`}>Manage Stock</Link></TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label="Edit"
                                            color="primary"
                                            onClick={() => handleEditRow(data.id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}
