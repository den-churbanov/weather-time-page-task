import React from 'react'
import '../styles/app.css'
import {Helmet} from "react-helmet-async";

export const HomePage: React.FC = () => {

    const getHelloMessage = () => {
        const hours = new Date().getHours()
        if (hours >= 23 || hours <= 6) return "Доброй ночи!"
        if (hours > 6 && hours < 12) return "Доброго утра!"
        if (hours >= 12 && hours < 18) return "Доброго дня!"
        if (hours >= 18 && hours < 23) return "Доброго вечера!"
    }

    const quotes = ['Время — это капитал работника умственного труда',
        'Время — великий учитель',
        'Поле моей деятельности - это время',
        'Время — движущееся подобие вечности',
        'Единственная причина для существования времени — чтобы все не случилось одновременно'
    ]

    return (
        <>
            <Helmet>
                <title>Главная</title>
            </Helmet>
            <h1 className="hello-header">{getHelloMessage()}</h1>
            <h4>{quotes[Math.round(Math.random() * 4)]}</h4>
        </>

    )
}
