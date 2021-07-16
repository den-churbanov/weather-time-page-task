import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {Icon} from './svg-icons/Icon'
import IconsSVG from './svg-icons/social-icons-sprite.svg'

/**
 * for support svg import put into ./src/@types/assets/index.d.ts next declaration:
 declare module "\*.svg" {
      import React = require("react");
      export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
      const src: string;
      export default src;
 * more: https://duncanleung.com/typescript-module-declearation-svg-img-assets/
}**/

type SocialLink = {
    href: string,
    className: string,
    iName: string
}

export function CLink(href: string, className: string, iName: string) {
    return {
        href,
        className,
        iName
    }
}

export const Header: React.FC = () => {
    const [mobileActive, setMobileActive] = useState(false)

    const links: Array<SocialLink> =
           [CLink('tel:+79278988843', 'phone-icon', 'phone'),
            CLink('mailto:churbanov.dv@gmail.com', 'gmail-icon', 'gmail'),
            CLink('https://t.me/den_churbanov', 'tg-icon', 'tg'),
            CLink('https://vk.com/den_churbanov', 'vk-icon', 'vk'),
            CLink('https://instagram.com/den_churbanov', 'ig-icon', 'ig')]

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setMobileActive(prevState => !prevState)
    }

    const hideMenu = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (mobileActive) setMobileActive(false)
    }

    return (
        <header className="header">
            <div className="header-body">
                <div className={`bars${mobileActive ? ' is-active' : ''}`} onClick={toggleMenu}>
                    <span/>
                </div>
                <nav className={`site-header-list ${mobileActive ? 'active ' : ''}`}>
                    <div className="nav_item">
                        <Link to="/" className="nav_link" onClick={hideMenu}>На главную</Link>
                    </div>
                    <div className="nav_item">
                        <Link to="/time" className="nav_link" onClick={hideMenu}>Время</Link>
                    </div>
                    <div className="nav_item">
                        <Link to="/weather" className="nav_link" onClick={hideMenu}>Погода</Link>
                    </div>
                    <div className="social__column">
                        <span>Свяжитесь со мной:</span>
                        <ul className="social-menu">
                            {links.map((link, idx) => {
                                return (
                                    <li key={idx}>
                                        <a href={link.href}
                                           className={link.className}
                                           target="_blank"
                                           rel="noopener noreferrer">
                                            <Icon name={link.iName}
                                                  className="social-icon"
                                                  file={IconsSVG}/>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    )
}