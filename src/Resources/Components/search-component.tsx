import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";
import { ArrowDropDown, Close, Menu, PersonAddAlt, SearchOutlined } from '@mui/icons-material'
import React, { useEffect } from "react";
import { motion } from 'framer-motion'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { App, IApp, IQueryResponse } from "../../Interfaces";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ListResults from "./list-results";

export default function SearchComponent(props: {}) {
    const [isFocused, setisFocused] = React.useState(false)
    const [app, setApp] = useLocalStorage<IApp>("@App", App)
    const [openUserMenu, setopenUserMenu] = React.useState(false)
    const [results, setresults] = React.useState<IQueryResponse[]>()
    const [searchNow, setsearchNow] = React.useState(false)
    const { width, height } = useWindowSize()

    const $query = useQuery({
        queryKey: ['search', app.search.query],
        queryFn: async () => await axios<IQueryResponse[]>({
            method: 'POST',
            data: { q: app.search.query },
            url: `${import.meta.env.VITE_APP_SERVER_URL}/search`
        }),
        enabled: Boolean(app.search.query && isFocused && searchNow),
        retry: 0,
        cacheTime: 5000
    })

    useEffect(() => {
        if ($query.data?.data && $query.isFetched)
            setresults($query.data?.data)

        const timeOut = setTimeout(() => {
            setsearchNow(true)
        }, 1000);

        return () => {
            clearTimeout(timeOut)
            setsearchNow(false)
            if ($query.isError) {
                $query.remove()
            }
        }
    }, [app.search.query, $query.data?.data, $query.isLoading])

    const search_results_variant = {
        shown: { top: width <= 600 ? '3.4rem' : '110%', display: 'flex' },
        hide: { top: 10, display: 'none' }
    }

    const handleSearchInputUpdate = async (param: IApp['search']['actions'], payload: string) => {
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
                        placeholder={`Search... movies: `}
                    />
                    <Button className="is-icon">
                        <SearchOutlined />
                    </Button>
                    <motion.div
                        variants={search_results_variant}
                        animate={isFocused ? 'show' : 'hide'}
                        className="search-results"
                        data-searching={app.search.query}
                    >
                        {!$query.isLoading || <LinearProgress />}
                        <div className="results-container">
                            <div className="space-between" style={{ position: 'sticky', top: '0', zIndex: '2', background: 'var(--thick-grey)' }}>
                                <h3 className="h3-headline" style={{ textTransform: 'uppercase', fontWeight: '600', paddingLeft: 0 }}>
                                    {!app.search.query ? <span> </span> : <>Found <span className="blink">
                                        {results?.length}</span> Results For</>}&nbsp;
                                    <span className="blink">{app.search.query}</span>
                                </h3>
                                <Button className="is-icon"
                                    onClick={() => setisFocused(false)}>
                                    <Close />
                                </Button>
                            </div>
                            <ListResults
                                items={results}
                            />
                        </div>
                    </motion.div>
                </div>
                <Button
                    onClick={() => setopenUserMenu(s => !s)}
                    className={`${width <= 600 ? 'is-icon' : 'is-icon'} relative`}>
                    {/* {width <= 600 || <span className="span-text">{app?.user?.username}</span>} */}
                    {/* ?? 'open in telegram' */}
                    <ArrowDropDown />
                    {!openUserMenu ||
                        <motion.div
                            variants={search_results_variant}
                            animate={openUserMenu ? 'show' : 'hide'}
                            onClick={() => window.location.href = '//t.me/denofmovies_bot'}
                            className="user-drop-down">
                            <div className="space-between">
                                <span className="small-text">{app.user?.username ?? "Telegram"}</span>
                            </div>
                        </motion.div>
                    }
                </Button>
            </div>
        </Box >
    )
}