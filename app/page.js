"use client";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import WheelOfFortune from "./components/Wheel";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "./page.module.css";
const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		borderRadius: "1rem",
		boxShadow: "0 0 20px #fff",
	},
};

function Scene({ texts, setSelectedTriangle }) {
	return (
		<>
			<OrbitControls />
			<WheelOfFortune texts={texts} setSelectedTriangle={setSelectedTriangle} />

			{/* <ambientLight color="black" intensity={1000} position={[0, 0, 0]} /> */}
			{/* <spotLight
				color={[1, 0.25, 0.7]}
				intensity={400}
				angle={0.6}
				penumbra={0.5}
				position={[5, 5, 2]}
				castShadow
			/>
			<spotLight
				color={[0.14, 0.5, 1]}
				intensity={400}
				angle={0.6}
				penumbra={0.5}
				position={[-5, 5, 0]}
				castShadow
				shadow-bias={-0.0001}
			/> */}
		</>
	);
}

export default function Home() {
	const [selectedTriangle, setSelectedTriangle] = useState(0);
	const [modalIsOpen, setIsOpen] = useState(false);

	const texts = [
		"Get 20% off on gaming",
		"Buy one get one FREE gaming",
		"Get side table free with furniture order",
		"Get flat ₹100 off!",
		"Get 10% off on appliances",
		"Get flat ₹400 off!",
		"Get flat 30% off",
		"Get Oculus Quest 2 for 1 day",
	];

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
		setSelectedTriangle(null);
	}

	useEffect(() => {
		if (selectedTriangle !== null) openModal();
	}, [selectedTriangle]);

	return (
		<div className="main">
			<Canvas
				camera={{
					position: [0, 0, 7],
				}}
			>
				<Scene
					selectedTriangle={selectedTriangle}
					setSelectedTriangle={setSelectedTriangle}
					texts={texts}
				/>
			</Canvas>
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
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Example Modal"
			>
				<div className={styles.modal}>
					<h4>Congratulations!</h4>
					<p>
						You have won: <br /> <span> {texts[selectedTriangle]} </span>
					</p>
				</div>
			</Modal>
		</div>
	);
}
