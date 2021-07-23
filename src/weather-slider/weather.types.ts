type WeatherAlert = {
    description: string,
    end: number,
    event: string,
    sender_name: string,
    start: number,
    tags: Array<string>
}

type IWeather = {
    description: string,
    icon: string,
    id: number,
    main: string
}

export interface IWeatherCondition {
    clouds: number,
    dew_point: number,
    dt: number,
    feels_like: number | {
        day: number,
        eve: number,
        morn: number,
        night: number
    },
    humidity: number,
    moon_phase?: number,
    moonrise?: number,
    moonset?: number,
    pop?: number,
    pressure: number,
    sunrise: number,
    sunset: number,
    temp: number | {
        day: number,
        eve: number,
        max: number,
        min: number,
        morn: number,
        night: number
    },
    uvi: number,
    visibility: number,
    weather: Array<IWeather>,
    wind_deg: number,
    wind_gust: number,
    wind_speed: number
}

export interface IWeatherForecast {
    alerts: Array<WeatherAlert>,
    current: IWeatherCondition,
    daily: Array<IWeatherCondition>,
    lat: number,
    lon: number,
    timezone: string,
    timezone_offset: number
}

export interface IWeatherContext {
    forecast: IWeatherForecast | undefined,
    members: Array<IMemberInfo>,
    active: number,
    resetCurrentWeather: () => void
    getMembersByCityName: (city: string) => void
    toDate: (timestamp: number, withDay?: boolean, withTime?: boolean) => string,
    isLoading: boolean
}

export interface ICoords {
    latitude: string,
    longitude: string
}

export interface IMember {
    GeoObject: {
        Point: {
            pos: string
        },
        boundedBy: {
            Envelope: {
                lowerCorner: string,
                upperCorner: string
            }
        },
        description: string,
        metaDataProperty: {
            GeocoderMetaData: {
                Address: {
                    Components: Array<{
                        kind: string,
                        name: string
                    }>
                    country_code: string,
                    formatted: string
                },
                AddressDetails: {
                    Country: {
                        AddressLine: string,
                        AdministrativeArea: {
                            AdministrativeAreaName: string,
                            SubAdministrativeArea: {
                                Locality: {
                                    LocalityName: string
                                }
                                SubAdministrativeAreaName: string
                            }
                        },
                        CountryName: string,
                        CountryNameCode: string
                    }
                },
                kind: string,
                precision: string,
                text: string
            }
        },
        name: string
    }
}

export interface IMemberInfo {
    name: string,
    description: string,
    text: string,
    coords: ICoords
}