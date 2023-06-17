import { Box } from "@mui/material";
import React from "react";
import SearchComponent from "../../Components/search-component";
import FileSliderSection from "../../Components/file-slider-section";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IQueryResponse } from "../../../Interfaces";

export default function HomePage() {

    const files = useQuery({
        queryFn: async () => await axios<IQueryResponse[]>({
            method: 'POST',
            data: { q: "" },
            headers: { "Content-Type": 'application/json' },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/search`
        }),
        queryKey: ['files'],
        cacheTime: 0,
        refetchInterval: 20000,
        retry: true,
    })

    console.log(files.failureReason)

    return (
        <Box className='main-page-contents'>
            <SearchComponent />
            <main className="contents">
                <div className="section-container">
                    
                </div>
                {/* <div className="section-container" style={{ display: 'flex', padding: 10 }}>
                    <h1 style={{ margin: 'auto' }}>COMING SOON</h1>
                </div> */}
                <FileSliderSection
                    headline={`Latest uploads`}
                    fileIsLoading={files.isLoading}
                    items={files.data?.data} />
            </main>
        </Box>
    )
}