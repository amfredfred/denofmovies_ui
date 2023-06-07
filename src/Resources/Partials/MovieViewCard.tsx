import React, { useEffect, useRef, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, Rating, Slider, Tooltip } from '@mui/material'
import { ArrowBack, Cancel, Close, Download, DownloadDone, DownloadDoneTwoTone, DownloadTwoTone, Expand, ExpandLess, ExpandMore, Info, OpenInNewTwoTone, PauseCircle, PlayArrow, RemoveRedEye, Telegram } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { IQueryResponse } from '../../Interfaces'
import useDownloader from "react-use-downloader"
import { useWindowSize } from 'usehooks-ts'
import { timeTo } from '../../Helpers'

export default function MovieViewVCard(props: IQueryResponse) { /*VidPlayer['props']*/

    const { fileParentPath: url, fileIsLoading = false } = props

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isPaused, setisPaused] = useState(false)
    const [isShowingDownloadOption, setisShowingDownloadOption] = useState(false)
    const [isPlayable, setisPlayable] = useState(false)
    const [videoSource, setVideoSource] = React.useState<string | undefined>(url)
    const [videoDuration, setvideoDuration] = useState(0)
    const [videoCurrentPlayTime, setvideoCurrentPlayTime] = useState('0')
    const [isShwowingInfo, setisShwowingInfo] = useState(false)
    const { size, elapsed, percentage, download, cancel, error, isInProgress, } = useDownloader();
    const [videoNewName, setvideoNewName] = useState<string>(props.fileId as any)
    const [downloadLink, setdownloadLink] = useState<string | undefined>(undefined)
    const [isPendingDownload, setisPendingDownload] = useState<boolean>()
    const { width, height } = useWindowSize()

    React.useEffect(() => {
        if (url) {
            setVideoSource(url)
        }
    }, [videoRef, fileIsLoading])


    const file_mime = (fileUrl: string) => fileUrl?.slice(-5).split?.('.')[1]


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
        const { currentTime, duration } = e.target
        setvideoDuration(s => duration)
        setvideoCurrentPlayTime(s => currentTime)
    }
    const handleSliderUpdate = (e: any) => {
        const value = e?.target?.value
        videoRef.current?.setAttribute('currentTime', value)
        setvideoCurrentPlayTime(value)
    }

    const downloadFile = async () => {
        let renamed = videoNewName

        if (file_mime(videoNewName as any)) {
            console.log(file_mime, "DEDEDEDEd")
        }
        else {
            renamed = `${'fileName'}.${props.fileContent?.[0]}`
        }

        if (downloadLink) {
            console.log(renamed, downloadLink)
            await download(downloadLink as any, renamed)
            return
        }

    }

    const handleExpandInfo = () => {
        setisShwowingInfo(s => !s)
    }

    const fileUrl =
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80';
    const filename = 'beautiful-carpathia.jpg';



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
                    </>
                    : <>
                        <Button className='is-button'
                            onClick={() => {
                                setdownloadLink(s => fileUrl)
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
                            <span className="span-text no-break">{props?.fileOriginalSize}</span>
                            <Download />
                        </Button>
                    </>
            }
        </motion.div >
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
                        onTimeUpdate={handlePlayTimeUpdate}
                        onCanPlay={() => setisPlayable(true)}
                        onError={(e) => {
                            setisPlayable(false)
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
                            <Slider
                                max={videoDuration}
                                value={Number(videoCurrentPlayTime)}
                                color='primary'
                                onChange={handleSliderUpdate}
                                step={0.005}
                            />
                        </div>

                        {/* <Button className='is-icon '
                            disabled={fileIsLoading}
                            onClick={() => setisShowingDownloadOption(s => !s)}>
                            <Download />
                        </Button> */}

                    </div>
                </div>

            </div >

            <div className="video-content-info">
                <div className="space-between" style={{ paddingInline: '.4rem' }}>
                    <h2 className="h2-headline">
                        Potential Vitamin and Mineral Deficiency Risks on a Vegan Diet
                    </h2>
                    <motion.div
                        animate={{
                            rotate: isShwowingInfo ? '0deg' : '90deg'
                        }}
                    >
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
                                <span className='flex-align-center'>114{width <= 600 ? <RemoveRedEye style={{ fontSize: 14.5 }} /> : ' Views'}</span>
                                <span className='flex-align-center'>{timeTo(Date.now() - Math.random() * 1000200)}</span>
                            </div>

                            <div className="flex-align-center" style={{ flexWrap: 'wrap', justifyContent: 'right' }}>
                                <Rating color='red' />
                                <Tooltip arrow title='zip: 90,000,000' placement='left'>
                                    <Tooltip arrow title='10,000,000' placement='top'>
                                        <Button
                                            disabled={fileIsLoading}
                                            onClick={() => setisShowingDownloadOption(s => !s)}
                                            className='' style={{ display: 'flex', color: 'white', alignItems: 'center' }}>
                                            <span className="small-text">100M</span> {isShowingDownloadOption ? <Close /> : <DownloadTwoTone />}
                                        </Button>
                                    </Tooltip>
                                </Tooltip>
                            </div>
                        </div>
                        {!(isShowingDownloadOption && !fileIsLoading) || downloadOptions}
                    </div>

                    {
                        !isShwowingInfo ?
                            <p onClick={handleExpandInfo} style={{ whiteSpace: 'nowrap', paddingBottom: '.7rem', cursor: 'pointer' }}>
                                Have a question about this video? Leave it in the comment section at http://nutritionfacts.org/video/poten...
                            </p>
                            :
                            <>
                                <hr />
                                <h2 className="h2-headline" style={{ maxWidth: '100%', marginBottom: '.7rem', wordWrap: 'normal', 'whiteSpace': 'pre-wrap' }}>
                                    Potential Vitamin and Mineral Deficiency Risks on a Vegan Diet
                                </h2>
                                <p>
                                    Have a question about this video? Leave it in the comment section at http://nutritionfacts.org/video/poten...<br />
                                    and someone on the NutritionFacts.org team will try to answer it.<br /><br />

                                    Want to get a list of links to all the scientific sources used in this video? Click on Sources Cited at https://nutritionfacts.org/video/pote....<br />
                                    You’ll also find a transcript and acknowledgements for the video, my blog and speaking tour schedule, and an easy way to search (by translated language even) through our videos spanning more than 2,000 health topics.
                                    <br /><br />
                                    Thanks for watching. I hope you’ll join in the evidence-based nutrition revolution!<br /><br />
                                </p>
                            </>
                    }
                </div>
            </div>
        </Box>
    )
}