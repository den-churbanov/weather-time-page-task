import {useState, useCallback} from 'react'
import {ICoords, IMember, IMemberInfo} from '../weather-slider/weather.types'
import {useHttp} from './http.hook'

export const useYandexGeoAPI = () => {
    const YANDEX_API_KEY = '6261b031-9bb5-466a-858b-f3ee070251bf'
    const [members, setMembers] = useState<Array<IMemberInfo>>([])
    const [active, setActive] = useState(-1)
    const {request, loading} = useHttp()

    const getMemberInfoFromData = useCallback((member: IMember, idx?: number): IMemberInfo => {
        return {
            name: member.GeoObject.name,
            description: member.GeoObject.description,
            text: member.GeoObject.metaDataProperty.GeocoderMetaData.text,
            coords: getFeatureMemberCoords(member)
        }
    }, [])

    function getFeatureMemberCoords(member: any): ICoords {
        const coords: string[] = member.GeoObject.Point.pos.split(' ')
        coords.map(coord => parseFloat(coord).toFixed(3))
        return {
            latitude: coords[1],
            longitude: coords[0]
        }
    }

    const getMemberByCoords = useCallback(async (long: string, lat: string) => {
        const url = `https://geocode-maps.yandex.ru/1.x?` +
            `apikey=${YANDEX_API_KEY}` +
            `&sco=longlat` +
            `&kind=locality` +
            `&format=json` +
            `&geocode=${long},${lat}`
        const data = await request(url)
        if (data) {
            const members: Array<IMember> = data.response.GeoObjectCollection.featureMember
            const info = [members.map(getMemberInfoFromData)[0]]
            setMembers(info)
            if (info.length === 1) {
                setActive(0)
            }
        } else {
            setMembers([])
        }
    }, [getMemberInfoFromData, request])

    const getMembersByCityName = useCallback(async (city: string) => {
        const url = `https://geocode-maps.yandex.ru/1.x?` +
            `apikey=${YANDEX_API_KEY}` +
            `&format=json` +
            `&geocode=${city}`
        const data = await request(url)
        if (data) {
            const members: Array<IMember> = data.response.GeoObjectCollection.featureMember
            setMembers(members.map(getMemberInfoFromData))
            if (members.length === 1) {
                setActive(0)
            }
        } else {
            setMembers([])
        }
    }, [getMemberInfoFromData, request])

    const resetMembers = useCallback(() => {
        setMembers([])
    }, [])

    return {members, resetMembers, active, setActive, getMembersByCityName, getMemberByCoords, locationLoad: loading}
}