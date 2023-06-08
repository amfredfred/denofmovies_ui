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

export default function Watch() {


    const [search] = useSearchParams({ v: 'sddsd' })
    const [app, setApp] = useLocalStorage<IApp>("@App", App)

    const handleFocusFileUpdate = (param: IApp['actions'], payload: any) => {
        setApp((prev) => prev = ({ ...prev, 'focusedFile': { ...prev.focusedFile, [param as any]: payload } }))
    }

    const Res = useQuery({
        queryFn: async () => await axios<IQueryResponse>({
            method: 'post',
            data: { file_id: app?.focusedFile?.id },
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/view`
        }),
        queryKey: ['file', app?.focusedFile?.id],
        enabled: Boolean(app.focusedFile?.id),
        retry: true,
    })

    usePageMeta({
        metas: [{
            'content': Res.data?.data.fileId,
            'property': 'og:description',
        }],
        title: Res.status === 'success' ? Res.data?.data.fileId ?? "Watching now..." : "Wait"
    })

    useEffect(() => {
        console.log(app?.focusedFile?.id)
        if (search?.get('v')) {
            if (app?.focusedFile?.id !== search?.get('v'))
                handleFocusFileUpdate('id', search?.get('v'))
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
                    />
                </div>
                <div className="section-container" style={{ display: 'flex', padding: 10 }}>

                    <h1 style={{ margin: 'auto' }}>COMING SOON</h1>
                </div>
            </main>
        </Box>
    )
}