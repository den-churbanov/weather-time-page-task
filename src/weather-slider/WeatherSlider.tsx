import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useWeather} from './WeatherContext'
import {SliderCard} from './SliderCard'
import {Icon} from '../components/svg-icons/Icon'
import IconsSVG from './styles/weather-icons-sprite.svg'
import {Loader} from "../components/Loader";

enum Direction {
    left,
    right
}

interface ISliderParams {
    breakpoints: Array<{
        point: number,
        slidesToShow: number
    }>
}

export const WeatherSlider: React.FC<ISliderParams> = ({breakpoints}) => {
    const ITEM_MAR = 10
    const wrapper = useRef<HTMLDivElement>(null)

    const [sliderState, setSliderState] = useState({
        position: 0,
        slidesToScroll: 1,
        wrapperWidth: 1280
    })
    const [touchStart, setTouchStart] = useState(0)
    const [direction, setDirection] = useState<Direction>(Direction.right)

    const {current} = wrapper
    const wrapperWidth = current?.clientWidth

    const slidesToShow = useMemo(() => {
        for (const {slidesToShow, point} of breakpoints) {
            if (wrapperWidth! < point) return slidesToShow
        }
        return 5
    }, [wrapperWidth])

    const itemWidth = useMemo(() => {
        return (wrapperWidth! - (slidesToShow * 2 - 2) * ITEM_MAR) / slidesToShow
    }, [wrapperWidth, slidesToShow])

    const scrollX = itemWidth + 2 * ITEM_MAR

    useEffect(() => {
        setSliderState(prevState => ({
            ...prevState,
            wrapperWidth: wrapperWidth!,
            position: -scrollX
        }))
    }, [wrapperWidth])

    const {forecast, isLoading} = useWeather()

    const styles = {
        trackStyle: {
            transform: `translateX(${sliderState.position}px)`,
        },
        itemStyle: {
            minWidth: `${itemWidth}px`,
            margin: `0 ${ITEM_MAR}px`
        }
    }
    const weather = forecast?.daily

    //handlers
    const prevBtnHandler = (e: React.MouseEvent) => {
        if (Math.round(sliderState.position) === 0) return
        setSliderState(prevState =>
            ({
                ...prevState,
                position: prevState.position + prevState.slidesToScroll * scrollX,
            })
        )
    }
    const nextBtnHandler = (e: React.MouseEvent) => {
        if (Math.abs(sliderState.position) / scrollX === weather!.length - slidesToShow) return
        setSliderState(prevState =>
            ({
                ...prevState,
                position: prevState.position - prevState.slidesToScroll * scrollX,
            })
        )
    }
    const onTouchStartHandler = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX)
    }
    const onTouchMoveHandler = (e: React.TouchEvent) => {
        const dx = e.touches[0].clientX - touchStart
        dx < 0 ? setDirection(Direction.right) : setDirection(Direction.left)
        if (sliderState.position + dx > 10 ||
            Math.abs(sliderState.position + dx) > (weather!.length - slidesToShow) * scrollX + 10) return
        setTouchStart(e.touches[0].clientX)
        setSliderState(prevState => (
            {
                ...prevState,
                position: prevState.position + dx
            }
        ))
    }
    const onTouchEndHandler = (e: React.TouchEvent) => {
        const dx = sliderState.position % scrollX
        switch (direction) {
            case Direction.left:
                setSliderState(prevState => (
                    {
                        ...prevState,
                        position: prevState.position - dx
                    }
                ))
                break
            case Direction.right:
                if (Math.abs(dx) < itemWidth / 2) {
                    setSliderState(prevState => (
                        {
                            ...prevState,
                            position: prevState.position - dx
                        }
                    ))
                } else {
                    setSliderState(prevState => (
                        {
                            ...prevState,
                            position: prevState.position + (Math.abs(dx) - scrollX)
                        }
                    ))

                }
        }
        setTouchStart(0)
    }

    return (
        <div className="wrapper" ref={wrapper}>
            {isLoading ? <Loader/> :
                <>
                    {weather &&
                    <div className="slider-button prev" onClick={prevBtnHandler}>
                        <Icon name="slider-arrow" file={IconsSVG}/>
                    </div>}
                    <div className="slider-container">
                        <div className="slider-track" style={styles.trackStyle}
                             onTouchStart={onTouchStartHandler}
                             onTouchMove={onTouchMoveHandler}
                             onTouchEnd={onTouchEndHandler}>
                            {weather && weather.map((item, idx) => {
                                return <SliderCard key={idx} item={item} style={styles.itemStyle}/>
                            })}
                        </div>
                    </div>
                    {weather &&
                    <div className="slider-button next" onClick={nextBtnHandler}>
                        <Icon name="slider-arrow" file={IconsSVG}/>
                    </div>}
                </>
            }
        </div>
    )
}
