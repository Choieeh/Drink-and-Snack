import React from 'react';
import { BroswerRouter as Router, Switch, Link, Route } from "react-router-dom";
import About from "./routes/About";
import LandingPage from "./components/LandingPage/LandingPage";
import Navigation from "./components/routes/Navigation";
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'

function App(){
	return (<Router>
		<div>
			<switch>
				<Route exact path = '/' component = {LandingPage}/>
				<Route exact path = '/login' component = {LoginPage}/>
				<Route exact path = '/register' component = {RegisterPage}/>
			</switch>
			
		</div>  
	</Router>
    );
}
//내가 about으로 가면 About 컴포넌틀를 보여줘,. path랑 component가 이름이 같을 필요는 없음.
export default App;