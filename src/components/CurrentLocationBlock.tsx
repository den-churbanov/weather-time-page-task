import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useWeather} from '../weather-slider/WeatherContext'
import {CSSTransition, SwitchTransition} from 'react-transition-group'

const getCurrentLocationTimeString = (timezone: string) => {
    return new Date().toLocaleTimeString('ru', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

export const CurrentLocationBlock: React.FC = () => {

    const {getMembersByCityName, active, resetCurrentWeather, members, forecast} = useWeather()
    const [currentLocationTime, setTime] = useState<string>()
    const input = useRef<HTMLInputElement>(null)
    const findWeatherForecast = (e: React.MouseEvent) => {
        e.preventDefault()
        if (input.current && input.current.value.trim().length !== 0) {
            getMembersByCityName(input.current.value.trim())
        }
    }

    useEffect(() => {
        if (forecast)
            setTime(getCurrentLocationTimeString(forecast!.timezone));
        const timer = setInterval(() => {
            setTime(getCurrentLocationTimeString(forecast!.timezone));
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [forecast])

    const resetWeather = (e: React.MouseEvent) => {
        e.preventDefault()
        resetCurrentWeather()
    }

    const items = useMemo(() => {
        if (active === -1) return []
        return members[active].text.split(',')
    }, [members, active])

    return (
        <SwitchTransition>
            <CSSTransition key={active}
                           addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                           classNames="form-animation">
                <form className="location_form">
                    {active === -1 ?
                        <>
                            <div className="location_form__group">
                                <input type="input"
                                       ref={input}
                                       className="location_form__input"
                                       placeholder="Введите город"
                                       autoComplete="off"
                                       id="country" required/>
                                <label htmlFor="country"
                                       className="location_form__label">
                                    Введите город
                                </label>
                            </div>
                        </> :
                        <div className="current-location-block">
                            {items.map((item, idx) => {
                                if (!(items.length === 3) && idx === 2) return null
                                return <p className={idx === items.length - 1 ? 'city' : ''}
                                          key={idx}>{item}{idx !== items.length - 1 ? ',' : ''}</p>
                            })}
                            <div className="coords">
                                <span>{members[active].coords.latitude}</span>
                                <span>{members[active].coords.longitude}</span>
                            </div>
                            <div className="time">
                                <span>{currentLocationTime}</span>
                            </div>
                        </div>
                    }
                    <button className="btn"
                            onClick={active === -1 ? findWeatherForecast : resetWeather}>
                        {active === -1 ? 'Поиск' : 'Изменить'}
                    </button>
                </form>
            </CSSTransition>
        </SwitchTransition>
    )
}