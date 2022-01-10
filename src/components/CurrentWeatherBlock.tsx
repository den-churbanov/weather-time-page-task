import React, {useState} from 'react'
import {useWeather, HPA_TO_MMHG, windDirection} from '../weather-slider/WeatherContext'
import IconsSVG from '../weather-slider/styles/weather-icons-sprite.svg'
import {Icon} from './svg-icons/Icon'
import {CSSTransition, SwitchTransition} from 'react-transition-group'
import {getIconByID} from '../weather-slider/weather-conditions'

export const CurrentWeatherBlock = () => {

    enum InfoState {
        basic,
        external
    }

    const {toDate, forecast, isLoading} = useWeather()
    const [basic, setBasic] = useState(InfoState.basic)

    const setBasicHandler = (e: React.MouseEvent) => {
        e.preventDefault()
        setBasic(basic => basic === InfoState.basic ? InfoState.external : InfoState.basic)
    }

    const getTimeByTimeZone = (timestamp: number, timezone: string) => {
        return new Date(timestamp * 1000).toLocaleString('ru-RU', {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    if (!forecast) return null

    const current = forecast.current
    const temp = current.temp
    const feels = current.feels_like

    return (
        <div className="current-weather-card" onClick={setBasicHandler}>
            <h3>{toDate(forecast.current.dt * 1000, true)}</h3>
            <h5>{current.weather[0].description}</h5>
            <Icon name={getIconByID(current, forecast.timezone_offset)} className="main-icon" file={IconsSVG}/>
            <SwitchTransition>
                <CSSTransition key={basic}
                               addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                               classNames="form-animation">
                    {basic === InfoState.basic ?
                        <div className="card-content">
                            <div className="card-content-block">
                                <Icon name="celsius" className="card-icon" file={IconsSVG}/>
                                <div className="temp-wrapper">
                                    <p>За окном {typeof temp === 'number' ? Math.round(temp) : ''}&deg; C</p>
                                    <p>Ощущается как {typeof feels === 'number' ? Math.round(feels) : ''}&deg; C</p>
                                </div>
                            </div>
                            <div className="card-content-block">
                                <Icon name="pressure" className="card-icon pressure" file={IconsSVG}/>
                                <p>Давление: {Math.round(current.pressure * HPA_TO_MMHG)} мм. рт. ст.</p>
                            </div>
                            <div className="card-content-block">
                                <Icon name="wind" className="card-icon" file={IconsSVG}/>
                                <p>Ветер: {`${windDirection(current.wind_deg)} ${current.wind_speed}`} м/c</p>
                            </div>
                            <span>Нажмите для просмотра подробностей</span>
                        </div>
                        :
                        <div className="card-content">
                            <div className="card-content-block">
                                <Icon name="sunrise" className="card-icon" file={IconsSVG}/>
                                <p>Восход в {getTimeByTimeZone(current.sunrise, forecast.timezone)}</p>
                            </div>
                            <div className="card-content-block">
                                <Icon name="sunset" className="card-icon" file={IconsSVG}/>
                                <p>Закат в {getTimeByTimeZone(current.sunset, forecast.timezone)}</p>
                            </div>
                            <div className="card-content-block">
                                <Icon name="humidity" className="card-icon humidity" file={IconsSVG}/>
                                <p>Влажность воздуха {current.humidity}%</p>
                            </div>
                            <div className="card-content-block">
                                <Icon name="uv" className="card-icon" file={IconsSVG}/>
                                <p>УФ-индекс: {current.uvi}</p>
                            </div>
                            <span>Нажмите для возврата</span>
                        </div>
                    }
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}