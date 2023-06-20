import React, { useEffect, useRef, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, LinearProgress, Rating, Skeleton, Slider, Tooltip } from '@mui/material'
import { ArrowBack, ArrowForward, Cancel, Close, Download, DownloadTwoTone, Expand, ExpandLess, ExpandMore, FavoriteOutlined, Fullscreen, FullscreenExit, Info, OpenInBrowser, OpenInNewTwoTone, Pause, PauseCircle, PlayArrow, RemoveRedEye, Save, Settings, SkipNext, SkipPrevious, Telegram, VolumeDown, VolumeOff, VolumeUp, Web } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { App, IApp, IQueryResponse } from '../../../../Interfaces'
import useDownloader from "react-use-downloader"
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { change, difference, msToTime, percentageOf, timeTo } from '../../../../Helpers'

import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';

import { MediaCommunitySkin, MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'


export default function MovieViewVCard(props: IQueryResponse) { /*VidPlayer['props']*/

    const { filePath: url, fileIsLoading = false } = props
    const [app] = useLocalStorage<IApp>('@App', App)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const videoWrapperRef = useRef<HTMLDivElement>(null)
    const [isPaused, setisPaused] = useState(false)
    const [isShowingDownloadOption, setisShowingDownloadOption] = useState(false)
    const [isPlayable, setisPlayable] = useState(false)
    const [videoSource, setVideoSource] = React.useState<string>('https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4')
    const [isShwowingInfo, setisShwowingInfo] = useState(false)
    const { size, elapsed, percentage, download, cancel, error, isInProgress, } = useDownloader();
    const [downloadType, setdownloadType] = useState<'document' | 'zip'>('document')
    const [downloadMethod, setdownloadMethod] = useState<'web' | 'telegram'>('telegram')
    const [isPendingDownload, setisPendingDownload] = useState<boolean>()
    const { width, height } = useWindowSize()

    React.useEffect(() => {
        if (url) {
            setVideoSource(`${import.meta.env.VITE_APP_SV_UPLOADS}/${url}`)
        }
    }, [videoRef, fileIsLoading, app.focusedFile?.id, props.fileParentPath])


    React.useEffect(() => {

    }, [])

    const handleExpandInfo = () => setisShwowingInfo(s => !s)
    const handleDownload = (methodd: 'web' | 'telegram' = 'web') => downloader.mutate(methodd)
    const webDownload = async () => await download(videoSource, 'video.mp4')

    const downloader = useMutation({
        mutationFn: async (methodd: any) => await axios({
            url: `${import.meta.env.VITE_APP_SERVER_URL}/download`,
            method: 'post',
            data: {
                username: 'idevfred',
                compressed: downloadType,
                link: props.fileParentPath,
                uid: props.fileUniqueId,
                method: methodd

            },
        }),
        mutationKey: ['downloads']
    });


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
                            disabled={downloader.isLoading}
                            onClick={() => handleDownload('telegram')}>
                            <span className="span-text no-break">Send in Telegram </span>&nbsp;
                            <Telegram />
                        </Button>
                        <Button className='is-icon'>
                            {downloader.isSuccess ? '' :
                                downloader?.isLoading ?
                                    <CircularProgress color="success" size={12} /> :
                                    ''
                            }
                        </Button>
                        {downloadType !== 'zip' &&
                            <Button className='is-button'
                                disabled={downloader.isLoading}
                                onClick={webDownload}>
                                {/* () => handleDownload('web') */}
                                <span className="span-text no-break">Web Download</span>
                                <Web />
                            </Button>
                        }
                        <Button className='is-icon'
                            onClick={() => window.open(videoSource, '_blank')}
                            style={{ display: 'flex', alignItems: 'center' }}>
                            <OpenInNewTwoTone />
                        </Button>
                    </>
                    : <>
                        <Button className={`is-button ${(downloadType === 'zip') ? 'active' : ''}`}
                            disabled={downloadType === 'zip'}
                            onClick={() => setdownloadType('zip')}>
                            <span className="span-text no-break">Zip{/*{props?.fileSize}MB*/}</span>
                        </Button>
                        <Button className={`is-button ${(downloadType === 'document') ? 'active' : ''}`}
                            disabled={(downloadType === 'document')}
                            onClick={() => setdownloadType('document')}>
                            <span className="span-text no-break">{(props?.fileSize)?.toFixed?.(2)}MB</span>
                        </Button>
                        <Button
                            className='is-icon'
                            onClick={() => setisPendingDownload(true)}>
                            <DownloadTwoTone />
                        </Button>
                    </>
            }
        </motion.div >
    )

    return (
        <Box className='movie-view-card-container' >
            <motion.div
                className="video-wrapper"
                ref={videoWrapperRef}
                onContextMenu={() => { return false }}>
                <div className="video-wrapper" >
                    {
                        (isPaused || fileIsLoading) || <motion.img
                            animate={{ x: 0 }}
                            initial={{ x: -100 }}
                            exit={{ x: -100 }}
                            src={`${import.meta.env.VITE_APP_SV_UPLOADS}/${props.fileThumbnail}`}
                            className='video-paused-overlay' />
                    }
                    <MediaPlayer
                        title={props?.fileCaption}
                        aspect-ratio={16 / 9}
                        crossorigin=""
                        autoplay
                        onContextMenu={() => false}
                        className='video-player'
                        onEnded={() => setisPaused(false)}
                        src={videoSource}
                        onError={console.log}
                        poster={`${import.meta.env.VITE_APP_SV_UPLOADS}/${props.fileThumbnail}`}
                        onPlaying={() => setisPaused(true)}
                        onCanPlay={() => setisPlayable(true)}
                        onPause={() => ''}
                    >
                        <MediaOutlet>
                            <MediaPoster alt={props.fileCaption} />
                        </MediaOutlet>
                        <MediaCommunitySkin />
                    </MediaPlayer>
                </div>
            </motion.div>

            <div className="video-content-info">
                <div className="space-between" style={{ paddingInline: '.4rem' }}>
                    <h2 className="h2-headline" >
                        {props.fileIsLoading ? <Skeleton animation="wave" variant="rectangular" width={'100%'} height={30} /> : props.fileCaption}
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
                    {!props.fileIsLoading || <LinearProgress color="warning" variant="indeterminate" />}
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
                                    {props.fileCaption}
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: ` 
                                            <div>
                                            <script type="text/javascript">
                                                atOptions = {
                                                    'key' : 'a69d7afc5f48e4dde57e499dc706adb1',
                                                    'format' : 'iframe',
                                                    'height' : 90,
                                                    'width' : 728,
                                                    'params' : {}
                                                };
                                                document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://enginecorruptiontrice.com/a69d7afc5f48e4dde57e499dc706adb1/invoke.js"></scr' + 'ipt>');
                                            </script>
                                            </div>
                                    `}}
                                />
                                {/* <!-- Ezoic - under_page_title - under_page_title --> */}
                                <div id="ezoic-pub-ad-placeholder-103"> </div>
                                {/* <!-- End Ezoic - under_page_title - under_page_title --> */}
                                <p>
                                    {props.fileCaption}
                                    <br />
                                    <br />
                                </p>
                            </>
                    }
                </div>
            </div>
        </Box >
    )
}