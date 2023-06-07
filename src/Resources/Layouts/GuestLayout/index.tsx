import { Grid, Box } from "@mui/material";
import React from "react";
import SearchComponent from "../../Components/search-component";

export default function GuestLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <Grid className="layouts">
            <Box className='layout-contents'>
                <Box></Box>
                {children}
                <Box></Box>
            </Box>
        </Grid>
    )
}