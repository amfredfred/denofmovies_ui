import React, { useRef, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress } from '@mui/material'
import { Close, Download, Expand, Info, OpenInNewTwoTone, PauseCircle, PlayArrow } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { IQueryResponse } from '../../Interfaces'


export default function MovieViewVCard(props: IQueryResponse) { /*VidPlayer['props']*/

    const { fileParentPath: url, fileIsLoading = false } = props

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isPaused, setisPaused] = useState(false)
    const [isShowingDownloadOption, setisShowingDownloadOption] = useState(false)
    const [isPlayable, setisPlayable] = useState(false)
    const [videoSource, setVideoSource] = React.useState<string | undefined>(url)

    React.useEffect(() => {
        if (url) {
            setVideoSource(url)
        }
        console.log(url)
    }, [videoRef, fileIsLoading])


    const handleTogglePlay = () => {
        const paused = videoRef?.current?.paused
        paused ? videoRef?.current?.play() : videoRef?.current?.pause()
        setisPaused(paused as any)
    }

    const downloadFile = (fileLink: string) => {
        const a = document.createElement('a')
        a.setAttribute('download', fileLink)
        a.setAttribute('href', fileLink)
        // a.setAttribute('target', "_blank")
        a.click()
    }

    const downloadOptions = (
        <motion.div className="download-options">
            <div className="space-between" style={{ width: '100%', boxShadow: 'none' }}>
                <p>recommends <a >zip <Info style={{ fontSize: 14 }} /></a></p>
                <Button
                    style={{ boxShadow: 'none' }}
                    onClick={() => setisShowingDownloadOption(s => !s)}
                    className='is-icon'
                >
                    <Close />
                </Button>
            </div>
            <Button className='is-button'
                onClick={() => downloadFile(videoSource as any)}>
                <span className="span-text">Zipped {props?.fileSize}</span>
                <Download />
            </Button>
            <Button className='is-button'
                onClick={() => downloadFile(props.fileParentPath as any)}>
                <span className="span-text">Original {props?.fileOriginalSize}</span>
                <Download />
            </Button>
        </motion.div>
    )

    return (
        <Box className='movie-view-card-container' >

            <div className="video-wrapper" onContextMenu={() => { return false }}>

                <div className="video-wrapper">
                    <video
                        controls={false}
                        controlsList='nodownload'
                        onContextMenu={() => false}
                        className='video-player'
                        onEnded={() => setisPaused(false)}
                        playsInline
                        src={videoSource}
                        ref={videoRef}
                        style={{ pointerEvents: 'none' }}

                        onCanPlay={() => setisPlayable(true)}
                        onError={(e) => {
                            setisPlayable(false)
                            console.log(e)
                        }}
                    >
                        <source src={videoSource} type="video/mp4" />
                        <source src={videoSource} type="video/ogg" />
                        <source src={videoSource} type="video/mpeg" />
                    </video>
                </div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: 0, position: 'absolute' }}
                    // open={open}
                    // onClick={handleClose}
                    open={isShowingDownloadOption || fileIsLoading || !isPlayable}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <div className="video-contraols-panel"  >
                    <div className="space-between">
                        <div className="space-between">
                            <Button className='is-icon'
                                onClick={handleTogglePlay}
                                disabled={!isPlayable}
                            >
                                {isPaused ? <PauseCircle /> : <PlayArrow />}
                            </Button>
                        </div>

                        <Button className='is-icon '
                            disabled={fileIsLoading}
                            onClick={() => setisShowingDownloadOption(s => !s)}>
                            <Download />
                        </Button>

                    </div>
                </div>

                {!(isShowingDownloadOption && !fileIsLoading) || downloadOptions}
            </div >
        </Box >
    )
}