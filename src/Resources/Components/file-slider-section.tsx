import React from "react"
import { IFileSliderSection } from "../../Interfaces"
import { Button, CircularProgress, Skeleton } from "@mui/material"
import { ArrowForward, SkipNext, SkipPrevious } from "@mui/icons-material"
import { Link, NavLink } from "react-router-dom"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export function SlideControlsButton() {
    const swiper = useSwiper()
    return <div className="swipper-slide-buttons-container space-between" >
        <Button
            className="is-icon"
            onClick={() => swiper.slidePrev()}>
            <SkipPrevious />
        </Button>
        <Button
            className="is-icon"
            onClick={() => swiper.slideNext()}>
            <SkipNext />
        </Button>
    </div>
}

export default function FileSliderSection(props: IFileSliderSection) {
    const { items, headline } = props

    return (
        <div className="section-container">
            <div className="space-between headline">
                <div className="space-between" style={{ width: 'max-content', flexGrow: 0 }}>
                    <h2 className="h2-headline">{headline}</h2>&nbsp;
                    {props.fileIsLoading && <CircularProgress size={17} color="primary" />}
                </div>
                <span></span>
            </div>

            <Swiper
                className="swipper-main-lists"
                spaceBetween={15}
                slidesPerView={3.8}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                autoplay
                allowSlideNext
                allowSlidePrev
                loop
            >
                {
                    items?.map((item) => {
                        return (
                            <SwiperSlide
                                className="swipper-slide"
                            >
                                <NavLink
                                    key={item.fileId}
                                    to={`/${item.fileDownloadLink}` ?? '#invalid-video-link'}
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
                                            alt={item.fileCaption}
                                            loading="lazy"
                                            className="slide-card-thumb" />
                                        
                                    </div>
                                    <h3 className="h3-headline">{item.fileCaption}</h3>
                                </NavLink>
                            </SwiperSlide>
                        )
                    })
                }
                <br />
                <div className="space-between" style={{paddingInline:'1rem'}}>
                    {<SlideControlsButton />}

                    <Link to={''} className="space-between" style={{ width: 'max-content', flexGrow: 0 }}>
                        Explorer 
                        <Button className="is-icon">
                            <ArrowForward />
                        </Button>
                    </Link>
                </div>
            </Swiper>
        </div>
    )
}