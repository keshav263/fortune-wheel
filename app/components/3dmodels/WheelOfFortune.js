// WheelOfFortune.js
"use client";
import React, { useRef, useState, Suspense, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
	Center,
	RoundedBox,
	Text,
	Text3D,
	useHelper,
	useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import Leaf from "./Leaf";
const WheelOfFortune = ({ texts, showResult }) => {
	const [spinning, setSpinning] = useState(false);
	const discRef = useRef();
	const coneRef = useRef();
	const lightRef = useRef();
	const anotherLightRef = useRef();
	let spinSpeed = useRef(1);

	useFrame(() => {
		if (discRef.current && spinning) {
			spinSpeed.current =
				spinSpeed.current * (Math.random() * (0.99 - 0.95) + 0.95); // Adjust the decay factor as needed
			discRef.current.rotation.z += spinSpeed.current;

			if (Math.abs(spinSpeed.current) < 0.001) {
				// Use useEffect to set spinning to false only once
				setSpinning(false);
				checkConeIntersection();
			}
		}
	});

	const checkConeIntersection = () => {
		const cone = coneRef.current;

		if (cone) {
			const direction = new THREE.Vector3(0, 0, -1);
			const coneTipWorldPosition = new THREE.Vector3(0, 1, 2);

			// cone.getWorldPosition(coneTipWorldPosition);

			const arrowHelper = new THREE.ArrowHelper(
				direction,
				coneTipWorldPosition,
				10,
				"black" // Green color
			);
			// discRef.current.add(arrowHelper);

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
				// console.log("Cone is pointing to triangle index:", (i + 4) % 8);

				// console.log({ text });

				showResult({ index: (i + 4) % 8 });

				// You can perform additional actions based on the identified triangle index
			}
		}
	};

	// useHelper(lightRef, THREE.SpotLightHelper, "green");
	// useHelper(anotherLightRef, THREE.SpotLightHelper, "green");

	const planeTexture = useTexture("/textures/texture.jpeg");

	planeTexture.wrapS = THREE.RepeatWrapping;
	planeTexture.wrapT = THREE.RepeatWrapping;
	planeTexture.repeat.set(6, 6);

	return (
		<>
			{/* <axesHelper args={[10, 10, 10]} /> */}
			<spotLight
				ref={lightRef}
				castShadow
				position={[0, 6, 2]}
				rotateX={2}
				intensity={100}
				color="gold"
			/>
			<spotLight
				ref={anotherLightRef}
				castShadow
				position={[0, -8, 4]}
				rotateX={2}
				intensity={100}
				color="white"
			/>

			<group ref={discRef}>
				<Disc spinning={spinning} />
				{texts.map((text, index) => (
					<TriangleOnCircle
						text={text.description}
						key={index}
						index={index}
						total={texts.length}
					/>
				))}
			</group>
			<mesh receiveShadow position={[0, -3.3, 0]} rotation-x={Math.PI / 2}>
				<planeGeometry args={[50, 50]} />
				<meshStandardMaterial
					map={planeTexture}
					bumpMap={planeTexture}
					bumpScale={0.1}
					roughness={0.65}
					metalness={0.75}
					side={THREE.DoubleSide}
					color="#fff"
				/>
			</mesh>
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

const EarthModel = () => {
	const texture = useTexture("/assets/earth.jpeg");
	const earthRef = useRef();

	useFrame(({ clock }) => {
		const elapsedTime = clock.getElapsedTime();
		earthRef.current.rotation.x = elapsedTime * 0.2; // Adjust the speed of rotation here
		earthRef.current.rotation.y = elapsedTime * 0.2; // Adjust the speed of rotation here
	});

	return (
		<>
			<mesh ref={earthRef}>
				<sphereGeometry args={[0.25, 50, 50]} />
				<meshBasicMaterial map={texture} />
			</mesh>
		</>
	);
};

const Disc = () => {
	const texture = useTexture("/assets/wood.jpg");
	const dots = useRef([]);
	texture.wrapS = 2;
	texture.wrapT = 2;

	const createGoldenDot = (position) => {
		const geometry = new THREE.SphereGeometry(0.1, 36, 36);
		const material = new THREE.MeshBasicMaterial({ color: "gold" });
		const dot = new THREE.Mesh(geometry, material);
		dot.position.set(...position);
		return dot;
	};

	const numDots = 20;
	const radius = 3.2;
	for (let i = 0; i < numDots; i++) {
		const angle = (i / numDots) * Math.PI * 2;
		const x = radius * Math.cos(angle);
		const y = radius * Math.sin(angle);
		const dotPosition = [x, y, 0.1];
		dots.current.push(createGoldenDot(dotPosition));
	}

	// Animate the dots
	useFrame((state, delta) => {
		dots.current.forEach((dot, index) => {
			const blinkSpeed = 2; // Adjust blinking speed as needed
			const time = state.clock.elapsedTime * blinkSpeed;
			const intensity = Math.abs(Math.sin(time + 3 + index * 0.1)); // Adjust frequency with index

			// Interpolate between white and gold based on intensity
			const color = new THREE.Color().lerpColors(
				new THREE.Color("white"),
				new THREE.Color("yellow"),
				intensity
			);
			dot.material.color.set(color);
		});
	});

	return (
		<group>
			{/* <axesHelper /> */}

			<mesh position-z={0} rotation-x={Math.PI / 2}>
				<cylinderGeometry args={[3.4, 3.4, 0.1, 128, 32]} />
				<meshStandardMaterial
					// map={texture}
					color="#971D1C"
					side={THREE.DoubleSide}
				/>
			</mesh>

			{dots.current.map((dot, index) => (
				<primitive key={index} object={dot} />
			))}

			<mesh position-z={0.2} rotation-x={Math.PI / 2}>
				<cylinderGeometry args={[0.35, 0.35, 0.1, 128, 32]} />
				<meshStandardMaterial color="#971D1C" />
			</mesh>
			<mesh position-z={0.1}>
				<EarthModel />
			</mesh>
		</group>
	);
};

const Pointer = ({ coneRef }) => {
	return (
		<>
			<mesh ref={coneRef} rotation={[Math.PI, 0, 0]} position={[1.5, 3.2, 1.5]}>
				<Suspense fallback={null}>
					<Leaf />
				</Suspense>
			</mesh>
		</>
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

	const colorIndex = index % colors.length; // Use modulo to cycle through colors
	const textPosition = calculateTextPosition(index, total, radius);

	return (
		<group position={[0, 0, 0]} rotation={[0, 0, (Math.PI / 4) * index]}>
			<mesh
				userData={{ i: index, text }}
				geometry={geometry}
				name={`triangle_${index}`}
			>
				<meshStandardMaterial
					color={colors[colorIndex]}
					side={THREE.DoubleSide}
				/>
			</mesh>
			<Text
				position={textPosition}
				color="#fff"
				anchorX="center"
				anchorY="middle"
				fontSize={text.length > 30 ? 0.26 : 0.3} // Adjust the font size based on text length
				maxWidth={1.5}
				font="/assets/LuckiestGuy-Regular.ttf"
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

	const planeTexture = useTexture("/textures/texture.jpeg");
	planeTexture.wrapS = THREE.RepeatWrapping;
	planeTexture.wrapT = THREE.RepeatWrapping;
	planeTexture.repeat.set(6, 6);

	return (
		<group
			position={[0, -3.2, 2]}
			rotation-x={-Math.PI / 2 + 0.2}
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
				<meshStandardMaterial
					color="gold"
					map={planeTexture}
					bumpMap={planeTexture}
					bumpScale={0.1}
					roughness={0.65}
					metalness={0.75}
				/>
			</RoundedBox>

			<Center position={[0, 0, 0.15]}>
				<Text3D
					height={0.1}
					lineHeight={0.5}
					size={0.5}
					font="/assets/Luckiest_Guy_Regular.json"
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

const colors = [
	"#A0B738", // Tomato
	"#F3B63F", // Gold
	"#6DC5BC", // OrangeRed
	"#A0B738", // Tomato
	"#F3B63F", // Gold
	"#6DC5BC",
	"#A0B738", // Tomato
	"#F3B63F", // Gold
];

export default WheelOfFortune;
