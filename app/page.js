"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Html, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import "./page.css";
import WheelOfFortune from "./components/3dmodels/WheelOfFortune";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Button,
	Snackbar,
	Stack,
	Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FaGrinStars } from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import dayjs from "dayjs";

function Scene({ texts, showResult }) {
	const { viewport, camera } = useThree();

	useEffect(() => {
		let width = viewport.width * viewport.factor;

		if (width > 320) {
			camera.position.set(0, 0, 10);
		}
	}, [camera, viewport.width, viewport.factor]);

	return (
		<>
			{/* <Environment files="/env/alpha mayoris.hdr" background /> */}
			{/* <Environment preset="sunset" /> */}
			<ambientLight intensity={0.1} />
			<OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />
			<Suspense
				fallback={
					<Html>
						<p style={{ color: "#fff" }}>Loading wheel..</p>
					</Html>
				}
			>
				<WheelOfFortune texts={texts} showResult={showResult} />
			</Suspense>

			{/* <ambientLight intensity={10} /> */}
		</>
	);
}

export default function FortuneWheel() {
	const [dialogVisible, setDialogVisible] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedSegment, setSelectedSegment] = useState(null);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [lastSpinDate, setLastSpinDate] = useState("");
	const [remainingDay, setRemainingDay] = useState(null);
	const [isSkipped, setIsSkipped] = useState(false);
	// console.log("HELLO");

	const texts = [
		{
			type: "coupon",
			description: "Get flat 10% off on appliances",
			couponCode: "FKT2SX8L",
		},
		{
			type: "credit",
			description: "Get 50 Credits",
			amount: 500,
		},
		{
			type: "none",
			description: "Better luck next time",
		},
		{
			type: "coupon",
			description: "Get flat 30% off on gaming upto Rs 200",
			couponCode: "DO2BLPQS",
		},
		{
			type: "credit",
			description: "Get 100 Credits",
			amount: 100,
		},
		{
			type: "none",
			description: "Better luck next time",
		},
		{
			type: "coupon",
			description: "Get 10% off on furniture",
			couponCode: "XXDDD3U0",
		},
		{
			type: "credit",
			description: "Get 200 Credits",
			amount: 200,
		},
	];

	function showResult(props) {
		const index = props.index;
		setSelectedSegment(texts[index]);
		setDialogVisible(true);
	}

	function closeDialog() {
		setDialogVisible(false);
	}

	const redeemCouponHandler = async () => {
		// console.log({ selectedSegment });

		closeDialog();
	};

	return (
		<div className="canvas">
			<Snackbar
				open={message.length > 0}
				autoHideDuration={3000}
				onClose={() => setMessage("")}
				message={message}
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				sx={{ zIndex: 10000 }}
			/>
			<Canvas
				camera={{
					position: [0, 0, 7],
				}}
				shadows="soft"
			>
				<Scene
					showResult={showResult}
					texts={texts}
					lastSpinDate={lastSpinDate}
					remainingDay={remainingDay}
				/>
			</Canvas>
			<Dialog
				open={dialogVisible}
				sx={{
					"& .MuiDialog-paper": {
						borderRadius: "1rem",
						minWidth: "20rem",
					},
				}}
			>
				<Stack alignItems="flex-end" paddingTop="0.5rem" paddingRight="0.9rem">
					{isSkipped === true && (
						<Typography
							sx={{
								cursor: "pointer",
								color: "#909191",
								fontSize: "0.8rem",
							}}
						>
							{remainingDay} days left
						</Typography>
					)}
					{(isSkipped === false || isSkipped === "false") && (
						<Link
							component="button"
							onClick={() => {
								setDialogVisible(false);
							}}
						>
							<Typography
								sx={{
									cursor: "pointer",
									color: "#909191",
									fontSize: "0.8rem",
								}}
							>
								skip
							</Typography>
						</Link>
					)}
				</Stack>
				<Stack
					alignItems="center"
					sx={{
						color: "#28a745",
					}}
				>
					<DialogTitle
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "0.5rem",
						}}
					>
						{selectedSegment?.type === "none"
							? "Better luck next time"
							: "Congratulations!"}
						{selectedSegment?.type === "none" ? "" : <FaGrinStars />}
					</DialogTitle>
				</Stack>
				<DialogContent>
					{selectedSegment && (
						<>
							{selectedSegment.type === "coupon" && (
								<Stack justifyContent="center" alignItems="center">
									<Image
										src="/assets/winning_icon.png"
										width={150}
										height={150}
										alt="coupon"
									/>
									<Typography
										py={2}
										variant="title"
										fontWeight="bold"
										color="#a34437"
									>
										{selectedSegment.description}
									</Typography>
									<Button
										disabled={isLoading}
										sx={{
											backgroundColor: "#a34437",
											color: "#fff",
											marginTop: "10px",
											width: "100%",
											borderRadius: "0.9rem",
											"&:hover": {
												backgroundColor: "#a34437",
											},
										}}
										onClick={() => {
											redeemCouponHandler();
										}}
									>
										Redeem Coupon
									</Button>
								</Stack>
							)}
							{selectedSegment.type === "credit" && (
								<Stack justifyContent="center" alignItems="center">
									<Image
										src="/assets/winning_icon.png"
										width={150}
										height={150}
										alt="coupon"
									/>
									<Typography
										py={2}
										variant="title"
										fontWeight="bold"
										color="#a34437"
									>
										{selectedSegment.description}
									</Typography>
									<Button
										disabled={isLoading}
										sx={{
											backgroundColor: "#a34437",
											color: "#fff",
											marginTop: "10px",
											width: "100%",
											borderRadius: "0.9rem",
											"&:hover": {
												backgroundColor: "#a34437",
											},
										}}
										onClick={() => {
											redeemCouponHandler();
										}}
									>
										Redeem Coupon
									</Button>
								</Stack>
							)}
							{selectedSegment.type === "none" && (
								<Stack justifyContent="center" alignItems="center">
									<Button
										disabled={isLoading}
										sx={{
											backgroundColor: "#a34437",
											color: "#fff",
											marginTop: "10px",
											width: "100%",
											borderRadius: "0.9rem",
											"&:hover": {
												backgroundColor: "#a34437",
											},
										}}
										onClick={() => {
											redeemCouponHandler();
										}}
									>
										Continue
									</Button>
								</Stack>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>

			<div className="stage">
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
				<div className="layer"></div>
			</div>
		</div>
	);
}
