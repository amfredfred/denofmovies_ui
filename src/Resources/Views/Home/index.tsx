import { useEffect } from "react"
import usePageMeta from "../../../Hooks/usePageMeata"
import React from "react"
import { Box } from "@mui/material"
import SearchComponent from "../../Components/search-component"
import MovieViewVCard from "../../Partials/MovieViewCard"

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
            // console.log(Telegram.username)
        }
    })


    return (
        <Box className='main-page-contents'>
            <SearchComponent />
            <main className="contents">
                <div className="section-container">
                    <MovieViewVCard
                        url="https://api.telegram.org/file/bot6048275210:AAHsqBABDZj3gr82kI3uwpHK5tkpSIUNDTU/videos/file_4.mp4"
                    />
                </div>
            </main>
        </Box>
    )
}