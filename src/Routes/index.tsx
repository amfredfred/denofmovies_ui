import { HashRouter, Routes as Routers, Route } from "react-router-dom";
import E404 from "../Resources/Views/EPages/E404";
import Home from "../Resources/Views/Home";

import GuestLayout from "../Resources/Layouts/GuestLayout";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function Routes() {

    const QClient = new QueryClient()

    const Guests = (
        <GuestLayout>
            <Routers>
                <Route path="/" element={<Home />} />
                <Route path="/download/" element={<Home />} />
                <Route path="*" element={<E404 />} />
            </Routers>
        </GuestLayout>
    )

    return (
        <QueryClientProvider client={QClient}>
            <HashRouter>
                {Guests}
            </HashRouter>
        </QueryClientProvider>
    )
}