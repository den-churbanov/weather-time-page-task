import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useWeather, WeatherProvider} from './WeatherContext'
import {SliderItem} from './SliderItem'
import {Icon} from '../components/svg-icons/Icon'
import IconsSVG from './styles/weather-icons-sprite.svg'

enum Direction {
    left,
    right
}

export const WeatherSlider: React.FC = () => {
    const itemMargin = 10
    const wrapper = useRef<HTMLDivElement>(null)

    const forecast = new Array(10).fill(0).map((_, idx) => idx)
    const [sliderState, setSliderState] = useState({
        position: 0,
        slidesToScroll: 1,
        wrapperWidth: 1000
    })
    const [touchStart, setTouchStart] = useState(0)
    const [direction, setDirection] = useState<Direction>(Direction.right)
    const slidesToShow = useMemo(() => {
        const wrapperWidth = wrapper.current!?.clientWidth
        return wrapperWidth < 576 ? 2 :
            wrapperWidth < 992 ? 4 :
                wrapperWidth < 1500 ? 6 : 8
    }, [wrapper.current!?.clientWidth])
    const itemWidth = useMemo(() => {
        const wrapperWidth = wrapper.current!?.clientWidth
        return (wrapperWidth - (slidesToShow * 2 - 2) * itemMargin) / slidesToShow
    }, [wrapper.current!?.clientWidth, slidesToShow])
    const scrollX = itemWidth + 2 * itemMargin

    useEffect(() => {
        setSliderState(prevState => ({
            ...prevState,
            wrapperWidth: wrapper.current!?.clientWidth
        }))
    }, [wrapper])

    // const {forecast} = useWeather()

    //handlers
    const prevBtnHandler = (e: React.MouseEvent) => {
        if (sliderState.position === 0) return
        setSliderState(prevState =>
            ({
                ...prevState,
                position: prevState.position + prevState.slidesToScroll * scrollX,
            })
        )
    }
    const nextBtnHandler = (e: React.MouseEvent) => {
        if (Math.abs(sliderState.position) / scrollX === forecast.length - slidesToShow) return
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
            Math.abs(sliderState.position + dx) > (forecast.length - slidesToShow) * scrollX + 10) return
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
        console.log('dx', dx)
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

        // if (Math.abs(dx) < itemWidth / 2) {
        //
        // } else {

        // }
        setTouchStart(0)
    }

    const styles = {
        trackStyle: {
            transform: `translateX(${sliderState.position}px)`,
        },
        itemStyle: {
            minWidth: `${itemWidth}px`,
            margin: `0 ${itemMargin}px`
        }
    }

    return (
        <div className="wrapper" ref={wrapper}>
            <div className="slider-button prev" onClick={prevBtnHandler}>
                <Icon name="slider-arrow" file={IconsSVG}/>
            </div>
            <div className="slider-container">
                <div className="slider-track" style={styles.trackStyle}
                     onTouchStart={onTouchStartHandler}
                     onTouchMove={onTouchMoveHandler}
                     onTouchEnd={onTouchEndHandler}>
                    {forecast.map((item, idx) => {
                        return <SliderItem key={idx} item={item} style={styles.itemStyle}/>
                    })}
                </div>
            </div>
            <div className="slider-button next" onClick={nextBtnHandler}>
                <Icon name="slider-arrow" file={IconsSVG}/>
            </div>
        </div>
    )
}
