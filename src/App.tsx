import React from 'react'
import './styles/app.css'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async'
import {WrapperPage} from './pages/WrapperPage'
import {HomePage} from './pages/HomePage'
import {TimePage} from './pages/TimePage'
import {WeatherPage} from './pages/WeatherPage'

const App: React.FC = () => {
    return (
        <HelmetProvider>
            <Router>
                <Switch>
                    <WrapperPage>
                        <Route exact path="/" component={HomePage}/>
                        <Route exact path="/time" component={TimePage}/>
                        <Route exact path="/weather" component={WeatherPage}/>
                        <Redirect to="/weather"/>
                    </WrapperPage>
                </Switch>
            </Router>
        </HelmetProvider>
    )
}

export default App
