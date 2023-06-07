import { HashRouter, BrowserRouter, Routes as Routers, Route } from "react-router-dom";
import E404 from "../Resources/Views/EPages/E404";
import Home from "../Resources/Views/Home";

import GuestLayout from "../Resources/Layouts/GuestLayout";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Routes() {

    const [isLoading, setisLoading] = React.useState(false)

    const QClient = new QueryClient()


    const Guests = (
        <GuestLayout>
            <Routers>
                <Route path="" element={<Home />} />
                <Route path="download" element={<Home />} />
                <Route path="*" element={<E404 />} />
            </Routers>
            <Backdrop
                sx={{ color: '#fff', zIndex: 0, position: 'absolute' }}
                // open={open}
                // onClick={handleClose}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </GuestLayout>
    )

    return (
        <QueryClientProvider client={QClient}>
            <BrowserRouter>
                {Guests}
            </BrowserRouter>
        </QueryClientProvider>
    )
}