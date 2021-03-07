import React, {useState} from 'react';
import Axios from 'axios';
import {useDispatch} from  'react-redux';
import {loginUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function LoginPage(props) {
	
	const dispatch = useDispatch();
	
	const [Email, setEmail] = useState("")
	const [Password, setPassword] = useState("")
	//state의 초기값과 해당변수를 갱신할 수 있는 함수
	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value)
	}
	
	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value)
	}
	const onSubmitHandler = (event) => {
		event.preventDefault();
		
		let body = {
			email : Email,
			password: Password
		}
		
		dispatch(loginUser(body)).then(response => {
			if(response.payload.loginSuccess) {
				props.history.push('/')
			} else{
				alert('Error')
			}
		})
		//_actions 폴더에 loginUser 함수를 만들어줌.
		//서버로 email, password 보내기
	}
	
	return (
		<div style={{
				display:'flex', justifyContent: 'center', alignItems:'center', width:'100%', height : '100vh'}}>

			<form style={{display : 'flex', flexDirection : 'column'}} onSubmit = {onSubmitHandler}>
				<label>Email</label>
				<input type="email" value = {Email} onChange = {onEmailHandler}/>
				<label>Password</label>
				<input type = "password" value = {Password} onChange = {onPasswordHandler} />
				<br/>
				<button type = "submit">
					Login
				</button>
			</form>
		</div>
	)
}

export default withRouter(LoginPage)