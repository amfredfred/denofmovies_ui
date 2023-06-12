import { HashRouter, BrowserRouter, Routes as Routers, Route } from "react-router-dom";
import E404 from "../Resources/Views/EPages/E404";
import Home from "../Resources/Views/Watch";
import Watch from "../Resources/Views/Watch";



import GuestLayout from "../Resources/Layouts/GuestLayout";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Backdrop, CircularProgress } from "@mui/material";
import { useLocalStorage } from "usehooks-ts";
import { App, IApp } from "../Interfaces";

export default function Routes() {

    const [isLoading, setisLoading] = React.useState(false)
    const [app, setApp] = useLocalStorage<IApp>("@App", App)

    const QClient = new QueryClient()

    React.useEffect(() => {
        const Telegram = (window as any)?.Telegram?.WebApp
        if (Telegram) {
            const {
                bg_color,
                button_color,
                button_text_color,
                hint_color,
                link_color,
                secondary_bg_color,
                text_color,
            } = Telegram?.themeParams

            if (Telegram.backgroundColor) {
                const rootStyle = document.querySelector(':root') as any
                rootStyle.style.setProperty('--global-bg', bg_color || Telegram.headerColor || Telegram.backgroundColor)
                rootStyle.style.setProperty('--text-color', text_color)
                rootStyle.style.setProperty('--global-color', link_color)
                rootStyle.style.setProperty('--global-bg', Telegram.backgroundColor)
            }

            if (Telegram.initDataUnsafe?.user) {
                setApp(s => s = { ...s, user: { ...(Telegram.initDataUnsafe?.user as any), platform: Telegram.platform } })
            }
        }
    }, [])


    const Guests = (
        <GuestLayout>
            <Routers>
                <Route path="" element={<Home />} />
                <Route path="watch" element={<Watch />} />
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