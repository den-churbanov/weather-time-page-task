import React from 'react'
import {Helmet} from 'react-helmet-async'
import {WeatherProvider} from '../weather-slider/WeatherContext'
import {WeatherSlider} from '../weather-slider/WeatherSlider'
import {CurrentLocationBlock} from '../components/CurrentLocationBlock'
import {CurrentWeatherBlock} from '../components/CurrentWeatherBlock'

export const WeatherPage: React.FC = () => {

    const sliderBreakPoints = [
        {point: 360, slidesToShow: 1},
        {point: 576, slidesToShow: 2},
        {point: 800, slidesToShow: 3},
        {point: 992, slidesToShow: 4},
        {point: 1320, slidesToShow: 5},
        {point: 1500, slidesToShow: 6},
        {point: 2000, slidesToShow: 8}
    ]
    return (
        <>
            <Helmet>
                <title>Погода</title>
            </Helmet>
            <WeatherProvider>
                <div className="weather-container">
                    <div className="weather-container-row">
                        <CurrentWeatherBlock/>
                        <CurrentLocationBlock/>
                    </div>
                    <div className="weather-slider-panel">
                        <WeatherSlider breakpoints={sliderBreakPoints}/>
                    </div>
                </div>
            </WeatherProvider>
        </>
    )
}