const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	email:{
		type: String,
		trim: true,
		unique: 1
	},
	password: {
		type: String,
		minlength: 5
	},
	lastname: {
		type: String,
		maxlength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: {
		type: String
	},
	tokenExp: {
		//token 유효기간 token은 유효성 검사
		type: Number
	}
})

userSchema.pre('save', function( next ){
	var user = this;
	//this는 userSchema를 가리킴
	
	if(user.isModified('password'))
		{//비밀번호 암호화
		//salt를 이용해서 비밀번호를 암호화하게 됨. saltRound는 salt가 몇글자인지.
		bcrypt.genSalt(saltRounds, function(err, salt) {
			if(err) return next(err)

			bcrypt.hash(user.password, salt, function(err, hash){
				if(err) return next(err)
				user.password = hash
				next()
			})
		});} else{
			next()
		}
})

userSchema.methods.comparePassword = function(plainPassword, cb){
	//비밀번호는 암호화 되어있으므로 password를 암호화 시켜서 비교
	bcrypt.compare(plainPassword, this.password, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	})
}

userSchema.methods.generateToken = function(cb) {
	var user = this;
	//jsonwebtoken을 이용해서 token 생성
	var token = jwt.sign(user._id.toHexString(),  'secretToken')
	//secret 토큰을 넣으면 userid가 나와야함.
	user.token = token
	user.save(function(err, user) {
		if(err) return cb(err)
		cb(null, user)
	})
	
}

userSchema.statics.findByToken = function(token, cb) {
	var user = this;
	
	//토큰 decode
	jwt.verify(token, 'secretToken', function(err, decoded) {
		//유저 아이디를 이용해서 유저를 찾은 다음 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
		user.findOne({"_id" : decoded, "token": token}, function(err, user){
			if(err) return cb(err);
			cb(null, user)
		})
	})
}

const User = mongoose.model('User', userSchema)

module.exports = {User}