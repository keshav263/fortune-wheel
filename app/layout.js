import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Spin to Win",
	description:
		"Spin the wheel and win exciting rewards. Use this in your your website to add interactivity",
	applicationName: "Spin to Win",
	keywords: ["fortune-wheel", "spin", "wheel", "games"],
	authors: [{ name: "Keshav Chhaparia" }],
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
					rel="stylesheet"
				></link>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
