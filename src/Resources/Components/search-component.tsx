import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";
import { ArrowDropDown, Close, Menu, PersonAddAlt, SearchOutlined } from '@mui/icons-material'
import React from "react";
import { motion } from 'framer-motion'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { App, IApp, IQueryResponse } from "../../Interfaces";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ListResults from "./list-results";

export default function SearchComponent(props: {}) {
    const [isFocused, setisFocused] = React.useState(false)
    const [app, setApp] = useLocalStorage<IApp>("@App", App)
    const { width, height } = useWindowSize()

    const $query = useQuery({
        queryKey: ['search'],
        queryFn: async () => await axios<IQueryResponse[]>({
            method: 'POST',
            data: { q: app.search.query },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/search`
        }),
        // refetchInterval: 4000,
        enabled: Boolean(app.search.query),
        retry: 5000,
    })

    const $search = (query: string) => $query.refetch()

    const search_results_variant = {
        shown: { top: width <= 600 ? '3.4rem' : '110%', display: 'flex' },
        hide: { top: 10, display: 'none' }
    }

    const handleSearchInputUpdate = async (param: IApp['search']['actions'], payload: string) => {
        $search(payload)
        setApp((prev) => prev = ({ ...prev, 'search': { ...prev.search, [param]: payload } }))
    }

    return (
        <Box className='searcch-bar-contaner'>
            <div className="space-between">
                <Button className="is-icon"> <Menu /></Button>
                <div className="input-container">
                    <input
                        type="text"
                        className="text-input"
                        onFocus={() => setisFocused(s => true)}
                        // onBlur={() => setisFocused(s => false)}
                        value={!app.search?.query?.startsWith?.(' ') ? app.search?.query : ''}
                        onChange={({ target: { value } }) => handleSearchInputUpdate('query', (value))}
                        placeholder={`search: movies: ${Math.random()}`}
                    />
                    <Button className="is-button">
                        <SearchOutlined />
                    </Button>
                    <motion.div
                        variants={search_results_variant}
                        animate={isFocused ? 'show' : 'hide'}
                        className="search-results">
                        <LinearProgress />
                        <div className="results-container">
                            <div className="space-between" >
                                <h3 className="h3-headline" style={{ textTransform: 'uppercase', fontWeight: '600' }}>
                                    {!app.search.query || <>Found <span className="blink">
                                        {$query.data?.data?.length}</span> Results For</>}&nbsp;
                                    <span className="blink">{app.search.query}</span>
                                </h3>
                                <Button className="is-icon"
                                    onClick={() => setisFocused(false)}>
                                    <Close />
                                </Button>
                            </div>

                            <ListResults items={$query.data?.data} />
                        </div>
                    </motion.div>
                </div>
                <Button
                    onClick={() => window.location.href = '//t.me/denofmovies_bot'}
                    className={`${width <= 600 ? 'is-icon' : 'is-button bdr-5px'}`}>
                    {width <= 600 || <span className="span-text">{app?.user?.username ?? 'open in telegram'}</span>} <ArrowDropDown />
                </Button>
            </div>
        </Box>
    )
}