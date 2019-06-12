const saltRounds = 10;

const handleSignIn = (req, res, db, bcrypt) => {
	const { email, password } = req.body;
	if(!email || !password) {
		return res.status(400).json('incorrect form submission');
	}
	db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		//bcrpyt.compareSync is old version, new version unable to be used? -->>>> implement saltRounds and function into the old version
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash, function(err, res) {})
		if (isValid) {
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('unable to get user'))
		} else {
			res.status(400).json('wrong credentials')
		}
	})
	.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignIn: handleSignIn
}

// //to check password
// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
//     // res == false
// });