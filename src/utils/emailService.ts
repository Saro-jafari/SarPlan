import nodemailer from 'nodemailer';

export async function sendEmail(to: string, newPassword: string) {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail', 
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		const mailOptions = {
			from: `"پشتیبانی سایت" <${process.env.EMAIL_USER}>`,
			to,
			subject: 'بازیابی رمز عبور',
			html: `
                <h2>درخواست بازیابی رمز عبور</h2>
                <p>رمز عبور جدید شما: <strong>${newPassword}</strong></p>
                <p>لطفاً پس از ورود، رمز خود را تغییر دهید.</p>
            `,
		};

		await transporter.sendMail(mailOptions);
		console.log(`✅ ایمیل به ${to} ارسال شد!`);
	} catch (error) {
		console.error('❌ خطا در ارسال ایمیل:', error);
		throw new Error('خطا در ارسال ایمیل');
	}
}
