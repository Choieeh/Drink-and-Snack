import React, {useEffect} from 'react'
import axios from 'axios';
import {withRouter} from 'react-router-dom'

function LandingPage(props) {
	
	useEffect(() => {
		axios.get('/api/hello')
		//get req를 server에 보냄.
		.then(response => console.log(response.data))
		//다시 받은 res를 console.log 시킴
	}, [])
	
	const onClickHandler = () => {
		axios.get('/api/user/logout')
		.then(response => {
			if(response.data.success){
				props.history.push("/login")
			} else{
				alert("로그아웃을 실패했습니다.")
			}
		})
	}
	
	return (
		<div style={{
				display:'flex', justifyContent: 'center', alignItems:'center', width:'100%', height : '100vh'}}>
			<h2>시작페이지</h2>
			
			<button onClick={onClickHandler}>
				Logout
			</button>
		</div>
	)
}

export default withRouter(LandingPage)