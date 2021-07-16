import React from 'react'
import {Helmet} from 'react-helmet-async'
import {WeatherProvider} from '../weather-slider/WeatherContext'
import {WeatherSlider} from '../weather-slider/WeatherSlider'

export const WeatherPage: React.FC = () => {

    return (
        <>
            <Helmet>
                <title>Погода</title>
            </Helmet>
            <WeatherProvider>
                <div className="weather-container">
                    <div className="weather-slider-panel">
                        <WeatherSlider/>
                    </div>
                </div>
            </WeatherProvider>
        </>
    )
}