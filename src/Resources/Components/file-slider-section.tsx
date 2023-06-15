import React from "react"
import { IFileSliderSection } from "../../Interfaces"
import { Button, CircularProgress, Skeleton } from "@mui/material"
import { ArrowForward } from "@mui/icons-material"
import { Link } from "react-router-dom"

export default function FileSliderSection(props: IFileSliderSection) {
    const { items, headline } = props

    const [isLoadngImage, setisLoadngImage] = React.useState(true)

    return (
        <div className="section-container">
            <div className="space-between headline">
                <div className="space-between" style={{ width: 'max-content', flexGrow: 0 }}>
                    <h2 className="h2-headline">{headline}</h2>&nbsp;
                    {props.fileIsLoading && <CircularProgress size={17} color="primary" />}
                </div>
                <span></span>
            </div>
            <div className="slider-card-wrapper">
                {
                    items?.map((item) => {
                        return (
                            <Link
                                key={item.fileId}
                                to={item.fileDownloadLink ?? '#invalid-video-link'}
                                className="file-slide-card">
                                <div className="slider-thumb-wrap">
                                    <Skeleton
                                        variant="rectangular"
                                        height={'100%'}
                                        width={'100%'}
                                        className="slide-card-thumb absolute-center"
                                    />
                                    <img
                                        src={`${import.meta.env.VITE_APP_SV_UPLOADS}/${item.fileThumbnail}`}
                                        // alt={item.fileUniqueId}
                                        loading="lazy"
                                        className="slide-card-thumb" />
                                    <p className="card-caption">
                                        <br />
                                        {item.fileCaption}
                                    </p>
                                </div>
                                <h3 className="h3-headline">{item.fileCaption}</h3>
                            </Link>
                        )
                    })
                }
            </div>
            <br />
            <div className="space-between">
                <span></span>
                <Link to={''} className="space-between" style={{ width: 'max-content', flexGrow: 0 }}>
                    Explorer <ArrowForward />
                </Link>
            </div>
        </div>
    )
}