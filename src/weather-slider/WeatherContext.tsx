import React, {useCallback, useContext, useEffect, useState} from "react"

interface IWeatherContext {
    forecast: {},
    months: string[],
    weekdays: string[],
    condition: string[]
}

const WeatherContext = React.createContext({} as IWeatherContext)

export const useWeather = () => {
    return useContext(WeatherContext);
}

export const WeatherProvider: React.FC = ({children}) => {
    const API_KEY = '841dd3c90954c1762d38b9360112cc34'
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]
    const weekdays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
    const condition = ["Ясно, без осадков", "Облачно, без осадков", "Пасмурно без осадков", "Пасмурно, дождь", "Туман", "Гроза"]

    const [forecast, setForecast] = useState({})

    const getWeatherForecast = useCallback(() => {
        if (navigator.geolocation) { //check if geolocation is available
            navigator.geolocation.getCurrentPosition(function (position) {
                const url = `https://api.openweathermap.org/data/2.5/onecall?` +
                    `lat=${position.coords.latitude.toFixed(3)}` +
                    `&lon=${position.coords.longitude.toFixed(3)}` +
                    `&exclude=hourly,minutely&lang=ru&appid=${API_KEY}`
                fetch(url).then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('При загрузке произошла ошибка')
                    }
                }).then(data => {
                    setForecast(data)
                    console.log(data)
                }).catch(e => {
                    console.log(e)
                })
            })
        }

    }, [])

    useEffect(() => {
        getWeatherForecast()
    }, [getWeatherForecast])

    return (
        <WeatherContext.Provider value={{forecast, weekdays, months, condition}}>
            {children}
        </WeatherContext.Provider>
    )
}
