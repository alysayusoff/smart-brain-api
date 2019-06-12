const saltRounds = 10;

const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if(!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	//bcrpyt.hashSync is old version, new version unable to be used? -->>>> implement saltRounds and function into the old version
	const hash =  bcrypt.hashSync(password, saltRounds, function(err, hash){}) 
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};

// //technique 1(generate a salt and has on separate function calls)
// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });

// //technique 2 (auto-generate a salt and hash)
// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//   // Store hash in your password DB.
// });