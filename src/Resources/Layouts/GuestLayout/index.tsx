import { Grid, Box } from "@mui/material";
import React from "react";
import SideBarSticky from "../../Components/side-bar";

export default function GuestLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <Grid className="layouts">
            <Box className='layout-contents'>
                {/* <SideBarSticky /> */}
                <div className="content-main">
                    {children}
                    <Box></Box>
                    {/* <!-- Ezoic - bottom_of_page - bottom_of_page --> */}
                    <div id="ezoic-pub-ad-placeholder-104"> </div>
                    {/* <!-- End Ezoic - bottom_of_page - bottom_of_page --> */}
               </div>
            </Box>
        </Grid>
    )
}