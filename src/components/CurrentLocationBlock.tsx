import React, {useMemo, useRef} from 'react'
import {useWeather} from '../weather-slider/WeatherContext'
import {CSSTransition, SwitchTransition} from 'react-transition-group'

export const CurrentLocationBlock: React.FC = () => {

    const {getMembersByCityName, active, resetCurrentWeather, members} = useWeather()
    const input = useRef<HTMLInputElement>(null)
    const findWeatherForecast = (e: React.MouseEvent) => {
        e.preventDefault()
        if (input.current && input.current.value.trim().length !== 0) {
            getMembersByCityName(input.current.value.trim())
        }
    }

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