import React, { useRef, useState } from 'react'
import { Box, Button } from '@mui/material'
import { Download, Expand, PauseCircle, PlayArrow } from '@mui/icons-material'


export default function MovieViewVCard(props: any) { /*VidPlayer['props']*/

    const { url } = props

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isPaused, setisPaused] = useState(true)

    const [videoSource, setVideoSource] = React.useState<string | undefined>(url)

    React.useEffect(() => {
        if (url) {
            setVideoSource(url)
        }
    }, [videoRef])


    const handleTogglePlay = () => {
        const paused = videoRef?.current?.paused
        paused ? videoRef?.current?.play() : videoRef?.current?.pause()
        setisPaused(paused as any)
    }

    console.log(videoRef?.current?.paused, isPaused)

    return (
        <Box className='movie-view-card-container' >

            <div className="video-wrapper" onContextMenu={() => { return false }}>

                <div className="video-wrapper">
                    <video
                        controls={false}
                        controlsList='nodownload'
                        className='video-player'
                        onContextMenu={() => false}
                        src={videoSource}
                        ref={videoRef}
                        style={{ pointerEvents: 'none' }}
                    />
                </div>

                <div className="video-contraols-panel"  >
                    <div className="space-between">
                        <div className="space-between">
                            <Button className='is-icon'
                                onClick={handleTogglePlay}>
                                {isPaused ? <PauseCircle /> : <PlayArrow />}
                            </Button>
                        </div>

                        <Button className='is-button'
                            onClick={handleTogglePlay}>
                            <span className="span-text">Download</span>
                            <Download />
                        </Button>
                    </div>
                </div>
            </div >
        </Box >
    )
}