import React from 'react'
import ReactDOM from 'react-dom'
import {CSSTransition} from 'react-transition-group'

interface IAlertParams {
    children?: React.ReactNode,
    show: boolean,
    header?: string,
    hideHandler: () => void
}
/***
 * Component renders modal window with children react node
 * @param children -
 * @param hideHandler -
 * @param header - possibly window header
 * @param show - **/
export const Alert = ({children, show, hideHandler, header}: IAlertParams) => {
    // console.log('Alert render')
    return ReactDOM.createPortal(
        <CSSTransition in={show}
                       timeout={500}
                       classNames="blur-window"
                       unmountOnExit>
            <div className="blur-window">
                <div className="message_block">
                    <div className={`message_block_header${!header ? ' cont-left' : ''}`}>
                        {header ? <p>{header}</p> : null}
                        <div className="bars is-active"
                             onClick={hideHandler}>
                            <span/>
                        </div>
                    </div>
                    <div className="message_content">
                        {children}
                    </div>
                </div>
            </div>
        </CSSTransition>,
        document.getElementById('modal')!
    )
}