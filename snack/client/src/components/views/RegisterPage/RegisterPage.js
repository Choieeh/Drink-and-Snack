import React, {useState} from 'react';
import {useDispatch} from  'react-redux';
import {registerUser} from '../../../_actions/user_action'
import Axios from 'axios';
import {withRouter} from 'react-router-dom'

function RegisterPage(props) {
	const dispatch = useDispatch();
	
	const [Email, setEmail] = useState("")
	const [Password, setPassword] = useState("")
	const [Name, setName] = useState("")
	const [ConfirmPassword, setConfirmPassword] = useState("")
	//state의 초기값과 해당변수를 갱신할 수 있는 함수
	const onEmailHandler = (event) => {
		setEmail(event.currentTarget.value)
	}
	
	const onPasswordHandler = (event) => {
		setPassword(event.currentTarget.value)
	}
	
	const onNamedHandler = (event) => {
		setName(event.currentTarget.value)
	}
	
	const onConfirmPasswordHandler = (event) => {
		setConfirmPassword(event.currentTarget.value)
	}
	
	const onSubmitHandler = (event) => {
		event.preventDefault();
		
		if(Password !== ConfirmPassword){
			return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
		}
		
		let body = {
			email : Email,
			password: Password,
			name : Name,
			
		}
		
		dispatch(registerUser(body))
			.then(response => {
				if(response.payload.success) {
					props.history.push("/login")
				} else{
					alert("Failed to sign up")
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
				<label>Name</label>
				<input type = "text" value = {Name} onChange = {onNamedHandler} />
				<label>Password</label>
				<input type = "password" value = {Password} onChange = {onPasswordHandler} />
				<label>Confirm Password</label>
				<input type = "password" value = {ConfirmPassword} onChange = {onConfirmPasswordHandler} />
				<br/>
				<button type = "submit">
					회원가입
				</button>
			</form>
		</div>
	)
}

export default withRouter(RegisterPage)