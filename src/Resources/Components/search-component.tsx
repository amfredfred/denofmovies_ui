import { Box, Button } from "@mui/material";
import { ArrowDropDown, Menu, PersonAddAlt, SearchOutlined } from '@mui/icons-material'
import React, { ChangeEventHandler } from "react";
import { motion } from 'framer-motion'
import { useLocalStorage } from 'usehooks-ts'
import { App, IApp } from "../../Interfaces";

export default function SearchComponent(props: {}) {
    const [isFocused, setisFocused] = React.useState(false)
    const [app, setApp] = useLocalStorage<IApp>("@App", App)

    // console.log(app)

    const search_results_variant = {
        shown: { top: '110%', display: 'flex' },
        hide: { top: 10, display: 'none' }
    }

    const handleSearchInputUpdate = (param: IApp['search']['actions'], payload: string) => {
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
                        onBlur={() => setisFocused(s => false)}
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
                    </motion.div>
                </div>
                <Button className="is-button bdr-5px ">
                    <span className="span-text">@username</span> <ArrowDropDown />
                </Button>
            </div>
        </Box>
    )
}