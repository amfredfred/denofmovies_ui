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
                {/* <!-- Ezoic - bottom_of_page - bottom_of_page --> */}
                <div id="ezoic-pub-ad-placeholder-104"> </div>
                {/* <!-- End Ezoic - bottom_of_page - bottom_of_page --> */}
            </Box>
        </Grid>
    )
}