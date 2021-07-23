import React from 'react'
import {useWeather, windDirection} from './WeatherContext'
import IconsSVG from '../weather-slider/styles/weather-icons-sprite.svg'
import {IWeatherCondition} from './weather.types'
import {Icon} from '../components/svg-icons/Icon'
import {getIconByID} from './weather-conditions'

type SliderItemParams = {
    item: IWeatherCondition,
    style: {
        minWidth: string
    }
}
export const SliderCard: React.FC<SliderItemParams> = ({item, style}) => {

    const {toDate, forecast} = useWeather()

    if (!(typeof item.temp === 'object') || !forecast?.timezone_offset) return null

    return (
        <div className="slider-card" style={style}>
            <h5>{toDate(item.dt * 1000, true)}</h5>
            <span className="description">{item.weather[0].description}</span>
            <Icon name={getIconByID(item, forecast.timezone_offset)} file={IconsSVG} className="card-icon"/>
            <h5 className="day-temp">{`Днём  ${Math.round(item.temp.day)}`}&deg;C</h5>
            <h6 className="night-temp">{`Ночью  ${Math.round(item.temp.night)}`}&deg;C</h6>
            <p>Ветер: {`${windDirection(item.wind_deg)} ${item.wind_speed}`} м/c</p>
        </div>
    )
}