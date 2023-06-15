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
import { defaultMethod } from "react-router-dom/dist/dom"

export default function Watch() {
    const [search] = useSearchParams({ v: '' })
    const [app, setApp] = useLocalStorage<IApp>("@App", App)
    const [post, setpost] = React.useState<IQueryResponse>()
    const [isLoading, setisLoading] = React.useState(false)
    const [method, setmethod] = React.useState('random-one')
    const [current_id, setcurrent_id] = React.useState(1)

    const handleFocusFileUpdate = (param: IApp['actions'], payload: any) => {
        setApp((prev) => prev = ({ ...prev, 'focusedFile': { ...prev.focusedFile, [param as any]: payload } }))
    }

    const Res = useQuery({
        queryFn: async () => await axios<IQueryResponse>({
            method: 'GET',
            data: { v: app?.focusedFile?.id },
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/watch?v=${app?.focusedFile?.id}`
        }),
        queryKey: ['file', "VIDEO_PALYING"],
        enabled: Boolean(app.focusedFile?.id),
        retry: true,
    })
    
    const files = useQuery({
        queryFn: async () => await axios<IQueryResponse[]>({
            method: 'POST',
            data: { q: "a" },
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/search`
        }),
        queryKey: ['files'],
        cacheTime: 0,
        refetchInterval: 20000,
        retry: true,
    })

    const Random = useMutation({
        mutationFn: async ({ method, cid }: any) => await axios<IQueryResponse>({
            method: 'POST',
            data: { username: app.user?.username, method, cid },
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/random`
        }),
        mutationKey: ['files', [current_id]],
        retry: true
    })

    usePageMeta({
        metas: [{
            'content': post?.fileId,
            'property': 'og:description',
        }],
        title: !isLoading ? post?.fileCaption ?? "Watching now..." : "Wait"
    }, [])

    useEffect(() => {
        if (search?.get('v')) {
            if (app?.focusedFile?.id !== search?.get('v'))
                handleFocusFileUpdate('id', search?.get('v'))
            else
                handleFocusFileUpdate('id', null)
        } else {
            handleFocusFileUpdate('id', null)
        }

        if (Random.data?.data && !app?.focusedFile?.id) {
            // Res.remove()
            setisLoading(Random.isLoading)
            setpost(Random.data?.data)
        } else if (Res.data?.data ) {
            console.log('SUCCESSSS')
            // Random.reset()
            setisLoading(Res.isLoading)
            setpost(Res.data?.data)
        }
        console.log(Random.failureReason, Res.data?.data, Random.isLoading)
        if (!Boolean(app.focusedFile?.id) && !Random.isLoading && !post && !Res?.isLoading) {
            console.log('LOL')
            Random.mutate('')
        }

    }, [Res.data?.data, search])



    const handleSkipMethod = (method, current_id) => {
        setcurrent_id(method === 'next' ? current_id + 1 : method === 'prev' ? current_id - 1 : current_id)
        Random.mutate(method, current_id)
    }

    return (
        <Box className='main-page-contents'>
            <SearchComponent />
            <main className="contents">
                <div className="section-container">
                    <MovieViewVCard
                        fileSkip={handleSkipMethod}
                        {...post}
                        fileIsLoading={isLoading}
                    />
                </div>
                {/* <div className="section-container" style={{ display: 'flex', padding: 10 }}>
                    <h1 style={{ margin: 'auto' }}>COMING SOON</h1>
                </div> */}
                <FileSliderSection
                    headline={`Latest uploads`}
                    fileIsLoading={files.isLoading}
                    items={files.data?.data ?? [{}, {}, {}] as any} />
            </main>
        </Box>
    )
}