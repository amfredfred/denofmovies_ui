import { Box, Button } from "@mui/material";
import { ArrowDropDown, Menu, PersonAddAlt, SearchOutlined } from '@mui/icons-material'
import React from "react";

export default function SearchComponent(props: {}) {

    return (
        <Box className='searcch-bar-contaner'>
            <div className="space-between">
                <Button className="is-icon"> <Menu /></Button>
                <div className="input-container">
                    <input
                        type="text"
                        className="text-input"
                        placeholder={`search: movies: ${Math.random()}`}
                    />
                    <Button className="is-button">
                        <SearchOutlined />
                    </Button>
                </div>
                <Button className="is-button bdr-5px ">
                    <span className="span-text">@username</span> <ArrowDropDown />
                </Button>
            </div>
        </Box>
    )
}