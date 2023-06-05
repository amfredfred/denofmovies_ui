import { useEffect } from "react"
import usePageMeta from "../../../Hooks/usePageMeata"
import React from "react"
import { Box } from "@mui/material"
import SearchComponent from "../../Components/search-component"

export default function Home() {

    usePageMeta({
        metas: [{
            'content': 'HEY FRED FRED',
            'property': 'og:description',
        }],
        title: 'my new page'
    })

    useEffect(() => {
        const Telegram = (window as any)?.Telegram?.WebApp
        if (Telegram) {
            console.log(Telegram.username)
        }
    })


    return (
        <Box className='main-page-contents'>
            <SearchComponent />
            <main className="contents">
                <div className="section-container">
                    HEY FREF FRED
                </div>
            </main>
        </Box>
    )
}