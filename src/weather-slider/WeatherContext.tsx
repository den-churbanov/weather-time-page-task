import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useYandexGeoAPI} from '../hooks/yandex.geo.hook'
import {useHttp} from '../hooks/http.hook'
import {IWeatherContext, ICoords} from './weather.types'
import {Alert} from '../components/Alert'

export const HPA_TO_MMHG = 0.750064

const WeatherContext = React.createContext({} as IWeatherContext)

export const windDirection = (degrees: number) => {
    if (degrees >= 22 && degrees < 67) return 'северо-восточный'
    if (degrees >= 67 && degrees < 112) return 'восточный'
    if (degrees >= 112 && degrees < 157) return 'юго-восточный'
    if (degrees >= 157 && degrees < 202) return 'южный'
    if (degrees >= 202 && degrees < 247) return 'юго-западный'
    if (degrees >= 247 && degrees < 292) return 'западный'
    if (degrees >= 292 && degrees < 337) return 'северо-западный'
    if (degrees >= 337 || degrees < 22) return 'северный'
    return ''
}

export const useWeather = () => {
    return useContext(WeatherContext);
}

export const WeatherProvider: React.FC = ({children}) => {
    const WEATHER_API_KEY = '5de420bd1f4b9b2f9f8db3c42afa728e'

    function toDate(timestamp: number, withDay?: boolean, withTime?: boolean): string {
        const shortMonths = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
        const shortDays: Array<string> = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
        const date = new Date(timestamp)
        if (withDay) {
            return `${shortDays[date.getDay()]}, ${date.getDate()} ${shortMonths[date.getMonth()]}`
        }
        if (withTime) {
            return `${shortMonths[date.getMonth()]}
                 ${date.getDate()} 
                 ${date.getHours()}
                 :${date.getMinutes() === 0 ? '00' : date.getMinutes()}`
        }
        return `${shortMonths[date.getMonth()]} ${date.getDate()}`
    }

    const [forecast, setForecast] = useState(undefined)
    const {active, setActive, members, resetMembers, getMembersByCityName, getMemberByCoords, locationLoad} = useYandexGeoAPI()
    const {request, error, loading} = useHttp()
    const [errMsg, setErrMsg] = useState<string | undefined>(undefined)
    const [showErr, setShowErr] = useState<boolean>(false)

    const fetchForecast = useCallback(async (coords: ICoords) => {
        const url = `https://api.openweathermap.org/data/2.5/onecall?` +
            `lat=${coords.latitude}` +
            `&lon=${coords.longitude}` +
            `&exclude=hourly,minutely&lang=ru&units=metric&appid=${WEATHER_API_KEY}`
        const data = await request(url)
        setForecast(data)
    }, [request])

    const getForecastByCityCoords = useCallback(() => {
        if (active === -1) return
        if (members.length === 0) return setErrMsg('Местоположение не найдено')
        fetchForecast({
            longitude: members[active].coords.longitude,
            latitude: members[active].coords.latitude
        })
    }, [fetchForecast, members, active])

    const getForecastByGeolocation = useCallback(() => {
        if (navigator.geolocation) { //check if geolocation is available
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude.toFixed(3)
                const longitude = position.coords.longitude.toFixed(3)
                getMemberByCoords(longitude, latitude)
                fetchForecast({
                    latitude,
                    longitude
                })
            }, function () {
                setErrMsg('Не удалось получить доступ к вашему местоположению')
            })
        }
    }, [fetchForecast, getMemberByCoords, setErrMsg])

    //получение погоды при загрузке страницы по местоположению
    useEffect(() => {
        if (members.length === 0 && active === -1)
            getForecastByGeolocation()
    }, [getForecastByGeolocation])

    //получение погоды при выборе пользователем местоположения
    useEffect(() => {
        getForecastByCityCoords()
    }, [getForecastByCityCoords, active, members])

    useEffect(() => {
        setErrMsg(error)
    }, [error, setErrMsg])

    useEffect(() => {
        setShowErr(!!errMsg)
    }, [errMsg])

    const setActiveGeolocation = useCallback((e: React.MouseEvent) => {
        setActive(parseInt(e.currentTarget.id))
    }, [setActive])

    const resetCurrentWeather = useCallback(() => {
        setActive(-1)
        resetMembers()
    }, [setActive, resetMembers])

    const closeErrAlertHandler = () => {
        setShowErr(false)
    }

    const closeChooseAlertHandler = () => {
        setActive(0)
    }

    return (
        <>
            <Alert show={(members.length > 1 && active === -1)}
                   header="Выберите населённый пункт"
                   hideHandler={closeChooseAlertHandler}>
                {
                    members.length > 1 ?
                        <ul className="alert-members-list">
                            {members.map((member, idx) =>
                                <li key={idx}
                                    id={idx.toString()}
                                    onClick={setActiveGeolocation}>
                                    {member.text}
                                </li>
                            )}
                        </ul> : null
                }
            </Alert>
            <Alert show={showErr}
                   hideHandler={closeErrAlertHandler}>
                <span>{errMsg}</span>
            </Alert>
            <WeatherContext.Provider
                value={{
                    forecast,
                    members,
                    active,
                    resetCurrentWeather,
                    getMembersByCityName,
                    toDate,
                    isLoading: locationLoad || loading
                }}>
                {children}
            </WeatherContext.Provider>
        </>
    )
}
