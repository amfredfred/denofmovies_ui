import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { App, IApp } from '../../Interfaces'
import { motion } from 'framer-motion'

export default function SideBarSticky() {
    const [app] = useLocalStorage<IApp>("@App", App)

    const variant = {
        video_playing: {},
        show: {},
        hide: {}
    }

    return (
        <motion.div
            variants={variant}
            animate={{}}
            className="side-bar-ontainer">
            HEY FRED
        </motion.div>
    )
}