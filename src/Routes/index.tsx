import { HashRouter, Routes as Routers, Route } from "react-router-dom";
import E404 from "../Resources/Views/EPages/E404";
import Home from "../Resources/Views/Home";

import GuestLayout from "../Resources/Layouts/GuestLayout";
import React from "react";

export default function Routes() {

    const Guests = (
        <GuestLayout>
            <Routers>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<E404 />} />
            </Routers>
        </GuestLayout>
    )

    return (
        <HashRouter>
            {Guests}
        </HashRouter>
    )
}