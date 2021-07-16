import React from 'react'
import {Header} from "../components/Header"

export const WrapperPage: React.FC = ({children}) => {
    return (
        <React.Fragment>
            <Header/>
            <div className="content-container">
                {children}
            </div>
        </React.Fragment>
    )
}