import { useEffect } from "react"
import usePageMeta from "../../../Hooks/usePageMeata"
import React from "react"
import { Box } from "@mui/material"
import SearchComponent from "../../Components/search-component"
import MovieViewVCard from "../../Partials/MovieViewCard"
import { useSearchParams } from "react-router-dom"
import { useLocalStorage } from "usehooks-ts"
import { App, IApp, IQueryResponse } from "../../../Interfaces"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import process from "process"

export default function Home() {

    const [search] = useSearchParams({ q: 'sddsd' })
    const [app, setApp] = useLocalStorage<IApp>("@App", App)

    const handleFocusFileUpdate = (param: IApp['actions'], payload: any) => {
        setApp((prev) => prev = ({ ...prev, 'focusedFile': { ...prev.focusedFile, [param as any]: payload } }))
    }

    const Res = useQuery({
        queryFn: async () => await axios<IQueryResponse>({
            method: 'post',
            data: { file_id: app?.focusedFile?.id },
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/download`
        }),
        queryKey: ['file', app?.focusedFile?.id],
        enabled: Boolean(app.focusedFile?.id),
        retry: true,
    })


    console.log(Res.status)


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


        if (search?.get('q')) {
            if (app?.focusedFile?.id !== search?.get('q'))
                handleFocusFileUpdate('id', search?.get('q'))
        }
    }, [Res.data, Res.isError])


    return (
        <Box className='main-page-contents'>
            <SearchComponent />
            <main className="contents">
                <div className="section-container">

                    <MovieViewVCard
                        {...Res.data?.data}
                        fileIsLoading={Res.isLoading}
                    // url="https://api.telegram.org/file/bot6048275210:AAHsqBABDZj3gr82kI3uwpHK5tkpSIUNDTU/videos/file_4.mp4"
                    />
                </div>
            </main>
        </Box>
    )
}