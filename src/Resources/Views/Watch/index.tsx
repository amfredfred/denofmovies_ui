import { useEffect } from "react"
import usePageMeta from "../../../Hooks/usePageMeata"
import React from "react"
import { Box } from "@mui/material"
import SearchComponent from "../../Components/search-component"
import MovieViewVCard from "../../Partials/MediaPlayer/VideoPlayer"
import { useSearchParams } from "react-router-dom"
import { useLocalStorage } from "usehooks-ts"
import { App, IApp, IQueryResponse } from "../../../Interfaces"
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import FileSliderSection from "../../Components/file-slider-section"

export default function Watch() {
    const [search] = useSearchParams({ v: '' })
    const [app, setApp] = useLocalStorage<IApp>("@App", App)
    const [post, setpost] = React.useState<IQueryResponse>()
    const [isLoading, setisLoading] = React.useState(false)

    const handleFocusFileUpdate = (param: IApp['actions'], payload: any) => {
        setApp((prev) => prev = ({ ...prev, 'focusedFile': { ...prev.focusedFile, [param as any]: payload } }))
    }

    const IRequest = useQuery({
        queryFn: async () => await axios<IQueryResponse>({
            method: 'GET',
            data: { v: app?.focusedFile?.id },
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/watch?v=${app?.focusedFile?.id}`
        }),
        queryKey: ["files", app.focusedFile?.id],
        retry: 1000,
    })

    const files = useQuery({
        queryFn: async () => await axios<IQueryResponse[]>({
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/search`
        }),
        queryKey: ['files'],
        refetchInterval: 20000,
        enabled: Boolean(post?.fileId),
        retry: true,
    })

    usePageMeta({
        metas: [{
            'content': post?.fileId,
            'property': 'og:description',
        }],
        title: !isLoading ? post?.fileCaption ?? "Watching now..." : "Wait"
    }, [])


    useEffect(() => {
        const V = search.get('v')
        if (V)
            handleFocusFileUpdate('id', V)
    }, [search.get('v')])

    useEffect(() => {
        if (IRequest.data?.data && !IRequest.isLoading) {
            setpost(IRequest.data?.data)
        }
        return () => {
            // IRequest.remove()
        }
    }, [IRequest.data?.data, app.focusedFile?.id, IRequest.isLoading])

    return (
        <Box className='main-page-contents'>
            {/* <SearchComponent /> */}
            <div className="section-container">
                <MovieViewVCard
                    {...post}
                    fileIsLoading={IRequest.isLoading}
                />
            </div>
            {/* <FileSliderSection
                    headline={`New uploads`}
                    fileIsLoading={files.isLoading}
                    items={files.data?.data} /> */}
        </Box>
    )
}