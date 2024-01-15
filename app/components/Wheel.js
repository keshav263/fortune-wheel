// WheelOfFortune.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Center,
	RoundedBox,
	Text,
	Text3D,
	useTexture,
} from "@react-three/drei";
import * as THREE from "three";

const WheelOfFortune = ({ texts, setSelectedTriangle }) => {
	const [spinning, setSpinning] = useState(false);
	const discRef = useRef();
	const [rotationAngle, setRotationAngle] = useState(0); // Add state to track rotation angle
	const coneRef = useRef();
	let spinSpeed = useRef(1);

	// Rotate the disc
	useFrame(() => {
		if (discRef.current && spinning) {
			spinSpeed.current *= 0.98; // Adjust the decay factor as needed
			discRef.current.rotation.z += spinSpeed.current;

			if (Math.abs(spinSpeed.current) < 0.001) {
				// Use useEffect to set spinning to false only once
				setSpinning(false);
				checkConeIntersection();
			}

			setRotationAngle(discRef.current.rotation.z);
		}
	});

	const checkConeIntersection = () => {
		const cone = coneRef.current;

		if (cone) {
			const direction = new THREE.Vector3(0, -2, -1);
			const coneTipWorldPosition = new THREE.Vector3();

			cone.getWorldPosition(coneTipWorldPosition);
			// console.log({ coneTipWorldPosition });
			const raycaster = new THREE.Raycaster(coneTipWorldPosition, direction);

			// Check for intersections with each triangle
			const intersections = texts.map((text, index) => {
				const triangle = discRef.current.getObjectByName(`triangle_${index}`); // Assuming you name your triangles as 'triangle_0', 'triangle_1', and so on
				// console.log({ triangle });
				const intersectedObjects = [triangle];
				return raycaster.intersectObjects(intersectedObjects);
			});

			// console.log({ intersections });
			// Find the first intersection (closest triangle)
			const firstIntersection = intersections.find(
				(intersection) => intersection.length > 0
			);

			console.log({ firstIntersection });

			if (firstIntersection) {
				const { i, text } = firstIntersection[0].object.userData;

				// Now you have the index of the triangle the cone is pointing to
				console.log("Cone is pointing to triangle index:", (i + 4) % 8);

				console.log({ text });

				setSelectedTriangle((i + 4) % 8);

				// You can perform additional actions based on the identified triangle index
			}
		}
	};

	return (
		<>
			{/* <axesHelper args={[10, 10, 10]} /> */}
			<group ref={discRef}>
				<Disc spinning={spinning} />
				{texts.map((text, index) => (
					<TriangleOnCircle
						text={text}
						key={index}
						index={index}
						total={texts.length}
					/>
				))}
			</group>
			<SpinButton
				spinWheel={() => {
					setSpinning(true);
					spinSpeed.current = 1;
				}}
			/>
			<Pointer coneRef={coneRef} />
		</>
	);
};

const Disc = () => {
	const texture = useTexture("/wood.jpg");
	texture.wrapS = 2;
	texture.wrapT = 2;
	return (
		<group>
			<mesh rotation-x={Math.PI / 2}>
				<cylinderGeometry args={[3.1, 3.1, 0.1, 128, 32]} />
				<meshBasicMaterial color={"#000"} side={THREE.DoubleSide} />
			</mesh>
			<mesh position-z={-0.1} rotation-x={Math.PI / 2}>
				<cylinderGeometry args={[3.3, 3.3, 0.1, 128, 32]} />
				<meshBasicMaterial
					map={texture}
					color="brown"
					side={THREE.DoubleSide}
				/>
			</mesh>
		</group>
	);
};

const Pointer = ({ coneRef }) => {
	const texture = useTexture("/wood.jpg");
	texture.wrapS = 2;
	texture.wrapT = 2;
	return (
		<mesh ref={coneRef} rotation={[0, 0, Math.PI]} position={[0, 2.8, 0.2]}>
			<coneGeometry args={[0.3, 0.6, 4, 32]} />
			<meshBasicMaterial map={texture} attach="material" color="brown" />
		</mesh>
	);
};

const TriangleOnCircle = ({ index, total, text }) => {
	const radius = 2.7; // Radius of the disc

	// roundedTriangle.lineTo(1.116, radius);
	// roundedTriangle.lineTo(-1.116, radius);
	// roundedTriangle.quadraticCurveTo(-1.116 / 4, radius * 1.25, 1.116, radius);

	const roundedTriangle = new THREE.Shape([0, 0]);

	roundedTriangle.moveTo(-1.116, radius); // Move to the left bottom vertex
	roundedTriangle.lineTo(0, 0); // Straight line to the top vertex
	roundedTriangle.lineTo(1.116, radius); // Straight line to the right bottom vertex
	roundedTriangle.quadraticCurveTo(0, radius * 1.16, -1.116, radius);

	const extrudeSettings = {
		steps: 1,
		depth: 0.2,
		bevelEnabled: false,
	};

	const geometry = new THREE.ExtrudeGeometry(roundedTriangle, extrudeSettings);
	const colors = [
		"#cf3030", // Tomato
		"#e58432", // Gold
		"#40a09b", // OrangeRed
		"#cf3030", // Tomato
		"#e58432", // Gold
		"#40a09b", // OrangeRed
		"#e58432", // Gold
		"#40a09b", // Cyan
	];
	const colorIndex = index % colors.length; // Use modulo to cycle through colors
	const textPosition = calculateTextPosition(index, total, radius);

	return (
		<group position={[0, 0, 0]} rotation={[0, 0, (Math.PI / 4) * index]}>
			<mesh
				userData={{ i: index, text }}
				geometry={geometry}
				name={`triangle_${index}`}
			>
				<meshBasicMaterial color={colors[colorIndex]} side={THREE.DoubleSide} />
			</mesh>
			<Text
				position={textPosition}
				color="#fff"
				anchorX="center"
				anchorY="middle"
				fontSize={text.length > 30 ? 0.26 : 0.3} // Adjust the font size based on text length
				maxWidth={1.5}
				font="/LuckiestGuy-Regular.ttf"
				textAlign="center"
				fontWeight={700}
			>
				{text}
			</Text>
		</group>
	);
};

const SpinButton = ({ spinWheel }) => {
	const ref = useRef();
	const { camera, raycaster, pointer } = useThree();
	useFrame((state, delta) => {
		raycaster.setFromCamera(pointer, camera);
		// Check if the ray intersects with the neon mesh
		const intersects = raycaster.intersectObjects([ref.current]);
		// If the mouse is over the neon mesh, update cursor style
		if (intersects.length > 0) {
			document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%2300dddd" width="30px" height="30px" viewBox="0 0 10.04 10.04"><circle cx="5.02" cy="5.02" r="4.52"/></svg>') 10 10, auto`;
		} else {
			document.body.style.cursor = "auto";
		}
	});

	return (
		<group
			position={[0, -4, 0]}
			rotation-x={-0.3}
			onClick={spinWheel}
			ref={ref}
		>
			<RoundedBox
				args={[3, 1, 0.2]} // Width, height, depth. Default is [1, 1, 1]
				radius={0.05} // Radius of the rounded corners. Default is 0.05
				smoothness={4} // The number of curve segments. Default is 4
				bevelSegments={4} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
				creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
			>
				<meshBasicMaterial color="#5216AA" />
			</RoundedBox>
			<Center position={[0, 0, 0.15]}>
				<Text3D
					height={0.1}
					lineHeight={0.5}
					size={0.5}
					font="/Luckiest_Guy_Regular.json"
				>
					SPIN
					<meshNormalMaterial />
				</Text3D>
			</Center>
		</group>
	);
};

const calculateTextPosition = (index, total, radius) => {
	return [0, -2.2, 0.22];
};

export default WheelOfFortune;
