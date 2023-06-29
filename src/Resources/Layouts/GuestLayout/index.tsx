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
               </div>
            </Box>
        </Grid>
    )
}