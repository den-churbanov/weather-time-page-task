import React, {useCallback, useEffect, useState} from 'react'
import {Helmet} from 'react-helmet-async'

export const TimePage: React.FC = () => {

    const getCurrentTime = useCallback((): string => {
        const date = new Date()
        const h = parseTimePart(date.getHours())
        const m = parseTimePart(date.getMinutes())
        const s = parseTimePart(date.getSeconds())
        return `${h}:${m}:${s}`
    }, [])

    const [time, setTime] = useState<string>(getCurrentTime())

    function parseTimePart(part: number) {
        return part.toString().length > 1 ? part.toString() : `0${part}`
    }

    useEffect(() => {
        const id = setInterval(() => {
            setTime(getCurrentTime())
        }, 1000);
        return () => clearInterval(id)
    }, [getCurrentTime])

    return (
        <>
            <Helmet>
                <title>Время</title>
            </Helmet>
            <h1 className="time-header">
                <span className="header-border"/>
                {time}
            </h1>
        </>
    )
}

