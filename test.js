const bcrypt = require('bcryptjs');

const password = 'newSecurePassword123'; // پسورد جدید

bcrypt.hash(password, 10, (err, hashedPassword) => {
	if (err) {
		console.error('Error hashing password:', err);
	} else {
		console.log('Hashed Password:', hashedPassword);
	}
});
