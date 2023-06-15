import React, { useEffect, useRef, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, LinearProgress, Rating, Skeleton, Slider, Tooltip } from '@mui/material'
import { ArrowBack, Cancel, Close, Download, DownloadTwoTone, Expand, ExpandLess, ExpandMore, FavoriteOutlined, Fullscreen, FullscreenExit, Info, OpenInBrowser, OpenInNewTwoTone, Pause, PauseCircle, PlayArrow, RemoveRedEye, Save, Settings, SkipNext, SkipPrevious, Telegram, VolumeDown, VolumeOff, VolumeUp } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { App, IApp, IQueryResponse } from '../../../../Interfaces'
import useDownloader from "react-use-downloader"
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { change, difference, msToTime, percentageOf, timeTo } from '../../../../Helpers'

export default function MovieViewVCard(props: IQueryResponse) { /*VidPlayer['props']*/

    const { fileParentPath: url, fileIsLoading = false } = props
    const [app] = useLocalStorage<IApp>('@App', App)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const videoWrapperRef = useRef<HTMLDivElement>(null)
    const [isPaused, setisPaused] = useState(false)
    const [isShowingDownloadOption, setisShowingDownloadOption] = useState(false)
    const [isPlayable, setisPlayable] = useState(false)
    const [videoSource, setVideoSource] = React.useState<string | undefined>(url)
    const [videoDuration, setvideoDuration] = useState(0)
    const [videoPlayedPercentage, setvideoPlayedPercentage] = useState(0)
    const [videoCurrentPlayTime, setvideoCurrentPlayTime] = useState('0')
    const [isShwowingInfo, setisShwowingInfo] = useState(false)
    const { size, elapsed, percentage, download, cancel, error, isInProgress, } = useDownloader();
    const [videoNewName, setvideoNewName] = useState<string>(props.fileId as any)
    const [downloadLink, setdownloadLink] = useState<string | undefined>(undefined)
    const [isPendingDownload, setisPendingDownload] = useState<boolean>()
    const [isPlayerHovered, setisPlayerHovered] = useState(false)
    const [playbackCtrlsHovered, setplaybackCtrlsHovered] = useState(false)
    const [nextButtonHovered, setnextButtonHovered] = useState(false)
    const [isInFullScreenMode, setisInFullScreenMode] = useState(false)
    const [currentVolumeRange, setcurrentVolumeRange] = useState(.3)
    const [isScrubbing, setisScrubbing] = useState(false)
    const [volumeControlHovered, setvolumeControlHovered] = useState(false)
    const { width, height } = useWindowSize()

    React.useEffect(() => {
        if (url) {
            setVideoSource(url)
        }
    }, [videoRef, fileIsLoading, app.focusedFile?.id])

    const playControlVariant = {
        show: { y: 0, display: 'flex' },
        hide: { y: 100, display: 'none' },
        hovered: { display: 'flex' },
        fullscreen: {}
    }


    useEffect(() => {
        const css_root = document.querySelector(':root') as any
        css_root?.style?.setProperty('--download-progress', `${percentage}%`)

    }, [percentage])

    const handleTogglePlay = () => {
        const paused = videoRef?.current?.paused;
        videoRef.current?.setAttribute('currentTime', videoCurrentPlayTime)
        paused ? videoRef?.current?.play() : videoRef?.current?.pause()
        setisPaused(paused as any)
    }

    const handlePlayTimeUpdate = (e: any) => {
        const $root = document.querySelector(':root') as any
        const { currentTime, duration } = e.target
        const playedPercentage = change(duration, currentTime)
        $root?.style?.setProperty?.('--video-play-time', `${playedPercentage.percentage}%`)
        setvideoPlayedPercentage(s => playedPercentage.percentage)
        setvideoDuration(s => duration)
        setvideoCurrentPlayTime(s => currentTime)
    }

    const handleCurrentPlayTimeChanged = (goto: number) => {
        (videoRef?.current as any).currentTime = (goto / videoDuration)
    }

    const theCursonPosition = (e: any) => {
        const timelineContainer = document.querySelector('.video-timeline-container')
        const rect = timelineContainer?.getBoundingClientRect() as any
        const percentage = Math.min(Math.max(0, e.screenX - rect?.x), rect.width) / rect.width * 100;
        const $root = document.querySelector(':root') as any
        $root?.style?.setProperty?.('--preview-position', `${percentage}%`)
        let videoWasPaused = false
        if (isScrubbing) {
            e.preventDefault()
            videoRef?.current?.pause?.()
            videoWasPaused= true
            handleCurrentPlayTimeChanged(percentage)
            $root?.style?.setProperty?.('--preview-position', `${percentage}%`)
        } else {
            if (videoWasPaused) {
                videoWasPaused= false
                videoRef?.current?.play?.()
            }
        }
        return { position: percentage }
    }

    const toggleScrubbing = (e: any) => {
        console.log(e?.buttons === 1)
        const timelineContainer = document.querySelector('.video-timeline-container')
        timelineContainer?.classList.toggle('scrubbing', isScrubbing)
        setisScrubbing(e?.buttons === 1)
        handleVideoTimeline(e)
    }

    const handleVideoTimeline = (e: any) => {
        const { position } = theCursonPosition(e)
    }


    const downloadFile = async () => {
        let renamed = videoNewName

        if (downloadLink) {
            console.log(renamed, downloadLink)
            await download(downloadLink as any, renamed)
            return
        }

    }

    const handleMetaDataloaded = () => {
        setcurrentVolumeRange(videoRef?.current?.volume as any)
    }

    const handleExpandInfo = () => {
        setisShwowingInfo(s => !s)
    }


    const handleVolumeChange = (range: number) => {
        setcurrentVolumeRange(range);
        handleToggleMute(range <= 0);
        (videoRef?.current as any).volume = range
    }

    const handleToggleMute = (muted?: boolean) => {
        (videoRef?.current as any).muted = muted ?? !videoRef?.current?.muted
    }

    const handleToggleFullScreen = async () => {
        const container = videoWrapperRef.current
        try {
            if (document.fullscreenElement) {
                setisInFullScreenMode(false)
                return await document.exitFullscreen();
            }
            await container?.requestFullscreen()
            setisInFullScreenMode(true)
        } catch (error) {
            console.log(error)
        }
    }

    const downloadOptions = (
        <motion.div className="download-options">
            {
                isInProgress ? (
                    <div className="space-between download-progress-wrapper" style={{ gap: 0 }}>
                        <Button className='is-button  download-progress' style={{ borderRadius: 0 }}>
                            <span className="span-text no-break">{isInProgress ? 'downloading' : 'stopped'} {percentage}%</span>
                        </Button>
                        <Button onClick={cancel} className='is-danger'>
                            <Cancel className='small-text' />
                        </Button>
                    </div>
                ) : isPendingDownload ?
                    <>
                        <Button
                            className='is-icon'
                            onClick={() => setisPendingDownload(false)}>
                            <ArrowBack />
                        </Button>
                        <Button className='is-button'
                            onClick={() => { }}>
                            <span className="span-text no-break">Send in Telegram </span>
                            <Telegram />
                        </Button>
                        <Button className='is-button'
                            onClick={downloadFile} >
                            <span className="span-text no-break">Download</span>
                            <Download />
                        </Button>
                        <Button className='is-icon'
                            onClick={() => window.open(downloadLink, '_blank')}
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <OpenInNewTwoTone />
                        </Button>
                    </>
                    : <>
                        <Button className='is-button'
                            onClick={() => {
                                setdownloadLink(s => '')
                                setisPendingDownload(true)
                            }}>
                            <span className="span-text no-break">Zip {props?.fileSize} </span>
                            <Download />
                        </Button>
                        <Button className='is-button'
                            onClick={() => {
                                setdownloadLink(s => props.fileParentPath)
                                setisPendingDownload(true)
                            }}>
                            <span className="span-text no-break">{props?.fileSize}</span>
                            <Download />
                        </Button>
                    </>
            }
        </motion.div >
    )


    return (
        <Box className='movie-view-card-container' >

            <motion.div
                onMouseOver={() => setisPlayerHovered(s => true)}
                onMouseOut={() => setisPlayerHovered(s => false)}
                // onDoubleClick={handleToggleFullScreen}
                className="video-wrapper"
                ref={videoWrapperRef}
                onContextMenu={() => { return false }}>
                <div className="video-wrapper"
                    onClick={handleTogglePlay}  >
                    {
                        (isPaused || fileIsLoading) || <motion.img
                            animate={{ x: 0 }}
                            initial={{ x:-100 }}
                            exit={{ x: -100 }}
                            src={props.fileThumbnail}
                            className='video-paused-overlay' />
                    }
                    <motion.video
                        controls={false}
                        controlsList='nodownload'
                        onContextMenu={() => false}
                        className='video-player'
                        onEnded={() => setisPaused(false)}
                        playsInline
                        src={videoSource}
                        ref={videoRef}
                        poster={props.fileThumbnail}
                        onPlaying={() => setisPaused(true)}
                        onLoadedData={handleMetaDataloaded}
                        autoPlay
                        // style={{ pointerEvents: 'none' }}
                        onTimeUpdate={handlePlayTimeUpdate}
                        onCanPlay={() => setisPlayable(true)}
                        onPause={() => ''}
                        onError={(e) => {
                            setisPlayable(false)
                        }}
                    >
                        <source src={videoSource} type={props?.fileType} />
                        <source src={videoSource} type="video/ogg" />
                        <source src={videoSource} type="video/mpeg" />
                    </motion.video>
                </div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: 0, position: 'absolute' }}
                    // open={open}
                    // onClick={handleClose}
                    open={isShowingDownloadOption || fileIsLoading || !isPlayable} >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <div className="video-contraols-panel"
                    onMouseOver={() => setplaybackCtrlsHovered(true)}
                    onMouseOut={() => setplaybackCtrlsHovered(false)}    >
                    <div className="videoplayback-controls">
                        <div className="timeline-wrapper">
                            <div className="video-timeline-container"
                                onMouseDown={(e) => toggleScrubbing(e)}
                                onMouseUp={(e) => toggleScrubbing(e)}
                                onMouseMove={handleVideoTimeline}>
                                <div className="video-timeline"
                                    video-play-time-percent={`${videoPlayedPercentage}%`}
                                />
                            </div>
                        </div>
                        <motion.div

                            animate={
                                (isInFullScreenMode && playbackCtrlsHovered && isPlayerHovered)
                                    ? 'hovered' : (isPlayerHovered && !isInFullScreenMode)
                                        ? 'hovered' : isPaused
                                            ? "hide" :
                                            'show'
                            }
                            variants={playControlVariant}
                            className="space-between player-controls-buttons">
                            <div className="space-between" style={{ flexGrow: 0, gap: 0 }}>
                                <Button className='is-button transparent'
                                    onClick={handleTogglePlay}
                                    disabled={!isPlayable}  >
                                    {isPaused ? <Pause /> : <PlayArrow />}
                                </Button>
                                <Button className='is-button  transparent'
                                    onClick={() => props?.fileSkip?.('previous')}  >
                                    <SkipPrevious />
                                </Button>
                                {/* Volume Controls */}
                                <Button className='is-button  transparent'
                                    onMouseOver={() => setvolumeControlHovered(s => true)}
                                    onMouseOut={() => setvolumeControlHovered(s => false)}
                                    disabled={!isPlayable} >
                                    <div className="icons space-between"
                                        onClick={() => handleToggleMute()}>
                                        {videoRef?.current?.muted ?
                                            <VolumeOff />
                                            : currentVolumeRange >= .5
                                                ? <VolumeUp />
                                                : <VolumeDown />}
                                    </div>
                                    <motion.input
                                        variants={{
                                            show: { width: 60, display: 'block' },
                                            hide: { width: 0, display: 'none' }
                                        }}
                                        animate={volumeControlHovered ? 'show' : 'hide'}
                                        max={1}
                                        step={0.01}
                                        type='range'
                                        onChange={({ target: { valueAsNumber } }) => handleVolumeChange(valueAsNumber)}
                                        value={currentVolumeRange}
                                    />
                                </Button>

                                <div className="playback-percentage">
                                    <span className="small-text">
                                        {msToTime(videoCurrentPlayTime as any)}&bull;{videoPlayedPercentage}%
                                    </span>
                                </div>
                            </div>
                            <div className="space-between" style={{ flexGrow: 0, gap: 0 }}>
                                <Button
                                    onClick={handleToggleFullScreen}
                                    className='is-button transparent'
                                    disabled={!isPlayable}  >
                                    {isInFullScreenMode ? <FullscreenExit /> : <Fullscreen />}
                                </Button>
                                <Button className='is-button  transparent'
                                    onMouseOver={() => setnextButtonHovered(h => true)}
                                    onMouseOut={() => setnextButtonHovered(h => false)}
                                    onClick={() => props?.fileSkip?.('next', props?.fileId)}  >
                                    <SkipNext />
                                </Button>
                                <Button className='is-button  transparent'
                                    disabled={!isPlayable} >
                                    <Settings />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <div className="video-content-info">
                <div className="space-between" style={{ paddingInline: '.4rem' }}>
                    <h2 className="h2-headline">
                        {props.fileIsLoading ? <LinearProgress /> : props.fileCaption}
                    </h2>
                    <motion.div
                        animate={{ rotate: isShwowingInfo ? '0deg' : '90deg' }}  >
                        <Button
                            onClick={handleExpandInfo}
                            className='is-icon'>
                            <ExpandMore />
                        </Button>
                    </motion.div>
                </div>


                <div
                    onDoubleClick={handleExpandInfo}
                    className="video-content-infos">
                    <div className="play-info"
                        style={{ background: isShwowingInfo ? 'var(--global-box-bg)' : 'transparent' }}>
                        <div className="space-between">

                            <div className="flex-align-center" style={{ flexWrap: 'wrap-reverse', justifyContent: 'left' }}>
                                <span className='flex-align-center'>
                                    {/* {'---'}{width <= 600 ? <RemoveRedEye style={{ fontSize: 14.5 }} /> : ' Views'} */}
                                </span>
                                <span className='flex-align-center'>{
                                    props.fileIsLoading ? <Skeleton animation="wave" width={60} height={'100%'} /> : timeTo(props?.fileCreatedAt ?? '')
                                }</span>
                            </div>

                            <div className="flex-align-center" style={{ flexWrap: 'wrap', justifyContent: 'right' }}>
                                {/* <Rating color='red' /> */}
                                <Save />
                                <Tooltip arrow title={`downloads: ${props.fileDownloadCount}`} placement='left'>
                                    <Button
                                        disabled={fileIsLoading}
                                        onClick={() => setisShowingDownloadOption(s => !s)}
                                        className='' style={{ display: 'flex', color: 'white', alignItems: 'center' }}>
                                        <span className="small-text">{props.fileDownloadCount}</span> {isShowingDownloadOption ? <Close /> : <DownloadTwoTone />}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        {!(isShowingDownloadOption && !fileIsLoading) || downloadOptions}
                    </div>

                    {
                        !isShwowingInfo ?
                            <p onClick={handleExpandInfo} style={{ whiteSpace: 'nowrap', paddingBottom: '.7rem', cursor: 'pointer' }}>
                                {props.fileCaption}
                            </p>
                            :
                            <>
                                <hr />
                                <h2 className="h2-headline" style={{ maxWidth: '100%', marginBottom: '.7rem', wordWrap: 'normal', 'whiteSpace': 'pre-wrap' }}>
                                    {props.fileIsLoading ? <LinearProgress /> : ''}
                                </h2>
                                <p>
                                    {props.fileCaption}
                                    <br />
                                    {/* <ins className="adsbygoogle"
                                        style={{ display: 'block', alignContent: 'center' }}
                                        data-ad-layout="in-article"
                                        data-ad-format="fluid"
                                        data-ad-client="ca-pub-9643693190346556"
                                        data-ad-slot="8971255154"></ins>
                                    <script>
                                        (adsbygoogle = window.adsbygoogle || []).push({ });
                                    </script> */}

                                    <div>
                                        {/* <!-- Ezoic - under_page_title - under_page_title --> */}
                                        <div id="ezoic-pub-ad-placeholder-103"> </div>
                                        {/* <!-- End Ezoic - under_page_title - under_page_title --> */}
                                   </div>
                                    <br />
                                </p>
                            </>
                    }
                </div>
            </div>
        </Box >
    )
}