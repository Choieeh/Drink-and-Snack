const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require("./middleware/auth");
const {User} = require("./models/User");

const config = require('./config/key')
//key에서 config를 받아온 후 mongoURI를 연결하도록 한다.

//application url 형식
app.use(bodyParser.urlencoded({extended:true}));
//application json 형식 가져오기
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
	useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex:true, useFindAndModify : false
}).then(() => console.log('MongoDB connect'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req, res) => {
	res.send("안녕하세요 ~")
})

app.post('/api/user/register', (req, res) => {
	//회원가입할때 필요한 정보들을 client에서 가져오면 DB에 넣어준다.
	
	const user = new User(req.body)
	//doc 에는 방금저장한 userinfo가 들어가 있음.
	user.save((err, doc) => {
		if(err) return res.json({success:false, err})
		return res.status(200).json({
			success: true
		})
	})
})

app.post('/api/user/login', (req, res) => {
	//요청된 email을 DB에서 있는지 찾는다.
	User.findOne({email : req.body.email }, (err, user) => {
		if(!user) {
			return res.json({
				loginSuccess: false,
				message: "제공된 이메일에 해당하는 유저가 없습니다."
			})
		}
		user.comparePassword(req.body.password, (err, isMatch) => {
			if(!isMatch)
			return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
			user.generateToken((err, user) => {
				if(err) return res.status(400).send(err);
				//토큰을 쿠키에 저장.
				res.cookie("x_auth",user.token)
				.status(200)
				.json({loginSuccess:true, userId: user._id})
			})
		})
	})
	//요청된 email이 DB에 있다면 비밀번호 확인.
	//비밀번호 까지 맞으면 토큰 생성.
})

app.get('/api/user/auth', auth, (req, res) => {
	//가운데 auth는 midware
	//여기까지 minddleware를 통과해 왔다는 것은 auth가 True라는 말.
	res.status(200).json({
		//client에 전달해주는 것
		_id : req.user._id,
		isAdmin : req.user.role === 0 ? false : true,
		isAuth : true,
		email : req.user.email,
		name : req.user.name,
		lastname : req.user.lastname,
		role : req.user.role,
		image : req.user.image
	})
})

app.get('/api/user/logout', auth, (req, res) => {
	User.findOneAndUpdate({_id: req.user._id}, {token : ""}, 
	(err, user) => {
		if(err) return res.json({success:false, err});
		return res.status(200).send({
			success: true
		})
	})
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))