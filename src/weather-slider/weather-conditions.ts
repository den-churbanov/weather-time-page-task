import {IWeatherCondition} from './weather.types'

interface IInfo {
    conditions: Array<{ icon: string, id: Array<number> }>
}

const info: IInfo = JSON.parse('{"conditions":[{"icon":"thunderstorm-rain","id":[200,201,202]},{"icon":"light-thunderstorm","id":[210]},{"icon":"thunderstorm","id":[211,212,221,230,231,232]},{"icon":"drizzle","id":[300,301,302,310,311,312,313,314,321]},{"icon":"light-rain","id":[500,501,502,503,504]},{"icon":"hail","id":[511]},{"icon":"rain","id":[520,521,522,531]},{"icon":"light-snow","id":[600,601]},{"icon":"snow","id":[602,611,612,613]},{"icon":"snowy","id":[615,616,620,621,622]},{"icon":"haze","id":[701,711,721,731]},{"icon":"fog","id":[741,751,761,762,771]},{"icon":"tornado","id":[781]},{"icon":"clear","id":[800]},{"icon":"few-clouds","id":[801]},{"icon":"scattered-clouds","id":[802]},{"icon":"overcast-clouds","id":[803,804]}]}')

export const getIconByID = (current: IWeatherCondition, offset: number): string => {
    let name = ''
    for (const {icon, id} of info.conditions) {
        for (const idx of id) {
            if (idx === current.weather[0].id) name = icon
        }
    }
    if (name === 'few-clouds' || name === 'clear') {
        const now = new Date()
        const sunrise = new Date(current.sunrise * 1000 - (offset * 60 * 1000))
        const sunset = new Date(current.sunset * 1000 - (offset * 60 * 1000))
        if (now.getHours() > sunrise.getHours() && now.getHours() <= sunset.getHours()) return `${name}-d`
        return `${name}-n`
    }
    return name
}