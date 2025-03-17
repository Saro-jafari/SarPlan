import { ThemeProvider } from 'next-themes';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system">
			<div className="flex">{children}</div>
		</ThemeProvider>
	);
}
