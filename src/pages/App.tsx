import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2,
	Slide,
	Stack,
	Typography,
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import { Environment, Html, OrbitControls, Sky } from '@react-three/drei';

import { TransitionProps } from '@mui/material/transitions';
import { useDialog } from '../useDialog';
import useClassificaQuery from '../useClassificaQuery';
import { DefaultModel } from '../components/DefaultModel';
import { SwordIcon } from '../assets/SwordIcon';
import { ShieldIcon } from '../assets/ShieldIcon';

interface Team {
	id: number;
	name: string;
	total_match: number;
	win_match: number;
	image_url: string;
	briscola_total_match: number;
	briscola_win_match: number;
	params: {};
}

interface Player {
	id: number;
	model: string;
	trigger: boolean;
	action: string;
	defaultAction: string;
	sendAction: string;
	defaultVictory: string;
	defaultDefeat: string;
}

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='down' ref={ref} {...props} />;
});

function App() {
	const [classifica, setClassifica] = useState<Team[]>([]);
	const [checked, setChecked] = useState<number[]>([]);
	const [randomTeams, setRandomTeams] = useState<{
		team1: Team[];
		team2: Team[];
	}>({
		team1: [],
		team2: [],
	});

	const {
		classifica: data,
		classificaLoading,
		classificaFetching,
		setPlayerLose,
		setPlayerWin,
		setMatch,
	} = useClassificaQuery({});

	const confirmDialog = useDialog();

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [players, setPlayers] = useState<Player[]>([
		{
			id: 1,
			model: 'models/Loris.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Walking2',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 2,
			model: 'models/Francesco.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Walking7',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 3,
			model: 'models/Ale.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Walking8',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 4,
			model: 'models/Laura.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Injured_Walking',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 5,
			model: 'models/Achille.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Walking5',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 6,
			model: 'models/Cristian.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Walking3',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 7,
			model: 'models/Default.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Catwalk_Walk',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 8,
			model: 'models/Default.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Catwalk_Walk',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 9,
			model: 'models/Mattia.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Sneak_Walk',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 10,
			model: 'models/Cristina.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Walking1',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 11,
			model: 'models/Enrico.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Walking6',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
		{
			id: 12,
			model: 'models/Default.glb',
			trigger: false,
			action: 'Walking',
			defaultAction: 'Catwalk_Walk',
			sendAction: 'Walking',
			defaultVictory: 'Victory',
			defaultDefeat: 'Defeat',
		},
	]);

	useEffect(() => {
		console.log('DATA: ', data);

		if (classificaLoading === false && classificaFetching === false) {
			setClassifica(data as Team[]);
		}
		// setClassifica(data);
	}, [classificaLoading, classificaFetching, data]);

	return (
		<Stack width={'100%'}>
			<Stack direction={'row'} gap={5} sx={{ my: '20px', mx: '10px' }}>
				<Typography variant='h5'>Classifica</Typography>
				<Button
					variant='contained'
					disabled={checked.length < 4}
					onClick={() => {
						const team1: Team[] = [];
						const team2: Team[] = [];

						// Shuffle the checked array to ensure randomness
						const shuffledChecked = [...checked].sort(
							() => Math.random() - 0.5
						);

						shuffledChecked.forEach((id) => {
							const team = classifica.find((f) => f.id === id);
							if (team) {
								// Assign to team1 until it has 2 players, then to team2
								if (team1.length < 2) {
									team1.push(team);
								} else if (team2.length < 2) {
									team2.push(team);
								}
							}
						});

						// Make sure both teams have exactly 2 players
						if (team1.length === 2 && team2.length === 2) {
							setRandomTeams({ team1, team2 });
							handleClickOpen();
						} else {
							console.log(
								'Not enough players selected to form two teams of 2.'
							);
						}
					}}
				>
					Squadre Random
				</Button>
			</Stack>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby='alert-dialog-slide-description'
			>
				<DialogContent className='!p-0 !m-0'>
					<Stack width={'300px'} height={'200px'}>
						<Stack
							bgcolor={'yellow'}
							gap={0}
							sx={{ borderBottom: '1px solid black', pb: '20px' }}
							justifyContent={'center'}
							alignContent={'center'}
							width={'100%'}
						>
							<Stack
								bgcolor={'yellow'}
								direction={'row'}
								gap={2}
								className='py-3 px-2'
								justifyContent={'space-around'}
								alignItems={'center'}
								flex={1}
							>
								<Stack direction={'row'} gap={2}>
									<SwordIcon />
									<Typography fontSize={'18'}>
										{randomTeams.team1[0]?.name}
									</Typography>
								</Stack>
								<Stack direction={'row'} gap={2}>
									<ShieldIcon />
									<Typography fontSize={'18'}>
										{randomTeams.team1[1]?.name}
									</Typography>
								</Stack>
							</Stack>
							<Button
								sx={{ width: 'min-content', ml: 'auto', mr: 'auto' }}
								variant='contained'
								color='success'
								onClick={() => {
									console.log('Team1 : ', randomTeams.team1[0]);
									const winner_1 = randomTeams.team1[0]?.id;
									const winner_2 = randomTeams.team1[1]?.id;
									const loser_1 = randomTeams.team2[0]?.id;
									const loser_2 = randomTeams.team2[1]?.id;

									setMatch({
										winner_1: winner_1,
										winner_2: winner_2,
										loser_1: loser_1,
										loser_2: loser_2,
									});
									handleClose();
								}}
							>
								Vinto
							</Button>
						</Stack>

						<Stack
							bgcolor={'lightblue'}
							gap={0}
							sx={{ borderBottom: '1px solid black', pb: '20px' }}
							justifyContent={'center'}
							alignContent={'center'}
							width={'100%'}
						>
							<Stack
								flex={1}
								bgcolor={'lightblue'}
								direction={'row'}
								alignItems={'center'}
								gap={2}
								className='py-3 px-2'
								justifyContent={'space-around'}
							>
								<Stack direction={'row'} gap={2}>
									<SwordIcon />
									<Typography fontSize={'18'}>
										{randomTeams.team2[0]?.name}
									</Typography>
								</Stack>
								<Stack direction={'row'} gap={2}>
									<ShieldIcon />
									<Typography fontSize={'18'}>
										{randomTeams.team2[1]?.name}
									</Typography>
								</Stack>
							</Stack>
							<Button
								sx={{ width: 'min-content', ml: 'auto', mr: 'auto' }}
								variant='contained'
								color='success'
								onClick={() => {
									console.log('Team2 : ', randomTeams.team2[0]);
									const winner_1 = randomTeams.team2[0]?.id;
									const winner_2 = randomTeams.team2[1]?.id;
									const loser_1 = randomTeams.team1[0]?.id;
									const loser_2 = randomTeams.team1[1]?.id;

									setMatch({
										winner_1: winner_1,
										winner_2: winner_2,
										loser_1: loser_1,
										loser_2: loser_2,
									});
									handleClose();
								}}
							>
								Vinto
							</Button>
						</Stack>
					</Stack>
				</DialogContent>
			</Dialog>
			<Dialog
				open={confirmDialog.open}
				onClose={confirmDialog.handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					{`${confirmDialog.data?.name} ha ${confirmDialog.data?.action} il match?`}
				</DialogTitle>
				<DialogContent></DialogContent>
				<DialogActions style={{ justifyContent: 'center' }}>
					<Button
						onClick={() => {
							const newPlayers = [...players];
							const player = newPlayers.find(
								(f) => f.id === confirmDialog.data?.id
							);

							if (player) {
								player.trigger = !player.trigger;
								player.sendAction = confirmDialog.data?.animation;
							}
							setPlayers(newPlayers);
							if (confirmDialog.data?.action === 'vinto') {
								setPlayerWin(confirmDialog.data?.id);
							}
							if (confirmDialog.data?.action === 'perso') {
								setPlayerLose(confirmDialog.data?.id);
							}
							confirmDialog.handleClose({});
						}}
						autoFocus
						variant='contained'
						color='success'
					>
						Si
					</Button>
					<Button
						onClick={() => {
							confirmDialog.handleClose({});
						}}
						variant='contained'
						color='error'
					>
						No
					</Button>
				</DialogActions>
			</Dialog>
			<Grid2
				id='grid_data_!23'
				width={'100%'}
				container
				spacing={2}
				className='h-full'
			>
				{classifica.map((team, index) => (
					<Stack
						direction={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
						id={`team_${team.id}`}
						key={`team_${team.id}`}
					>
						<Canvas
							style={{
								width: '250px',
								height: '400px',
								position: 'relative',
								zIndex: 0,
							}}
							shadows
							camera={{ position: [0, 0.5, 5], fov: 30 }}
							id={`canvas_${team.id}`}
							key={`canvas_${team.id}`}
						>
							<Html
								style={{
									position: 'absolute', // Posizione assoluta rispetto al canvas
									top: -180, // Fissa in alto
									left: -110, // Fissa a sinistra
									zIndex: 1, // Porta in primo piano rispetto alla scena 3D
								}}
								position={[0, 0, 0]}
							>
								<Stack
									direction={'column'}
									height={'368px'}
									width={220}
									id={`stack_1_${team.id}`}
									justifyContent={'space-between'}
								>
									<Stack
										direction={'row'}
										gap={2}
										alignItems={'center'}
										justifyContent={'space-between'}
										id={`stack_2_${team.id}`}
										key={`stack_2_${team.id}`}
									>
										<Typography fontSize={'18px'}>{index + 1}</Typography>

										<Typography fontWeight={600} fontSize={'12px'}>
											{team.name}
										</Typography>

										<Typography fontWeight={500} fontSize={'12px'}>
											{team.win_match}/{team.total_match} -{' '}
											{team.total_match > 0
												? ((team.win_match / team.total_match) * 100).toFixed(2)
												: 0}
											%
										</Typography>
									</Stack>

									<Stack
										direction={'row'}
										style={{ width: '100%' }}
										gap={2}
										alignItems={'center'}
										justifyContent={'center'}
										id={`stack_3_${team.id}`}
										key={`stack_3_${team.id}`}
									>
										<Button
											variant='contained'
											color='success'
											sx={{ height: '20px' }}
											onClick={() => {
												confirmDialog.handleOpen({
													name: team.name,
													id: team.id,
													action: 'vinto',
													animation: 'Victory',
												});
											}}
										>
											Win
										</Button>
										<Button
											variant='contained'
											color='error'
											sx={{ height: '20px' }}
											onClick={() => {
												confirmDialog.handleOpen({
													name: team.name,
													id: team.id,
													action: 'perso',
													animation: 'Defeat',
												});
											}}
										>
											Lose
										</Button>
										<Box
											onClick={() => {
												const currentIndex = checked.indexOf(team.id);
												const newChecked = [...checked];

												if (currentIndex === -1) {
													newChecked.push(team.id);
												} else {
													newChecked.splice(currentIndex, 1);
												}

												setChecked(newChecked);
											}}
										>
											<Checkbox
												edge='start'
												checked={checked.includes(team.id)}
												tabIndex={-1}
												disableRipple
											/>
										</Box>
									</Stack>
								</Stack>
							</Html>
							<color attach='background' args={['#f0f0f0']} />
							<>
								<OrbitControls />
								<Sky sunPosition={[-100, 50, 100]} />
								<Environment preset='sunset' />

								<group position-y={-1}>
									{/* <DefaultAvatar
										player={players.find((f) => f.id === team.id)}
									/> */}
									<DefaultModel
										player={players.find((f) => f.id === team.id) as Player}
									/>
								</group>
								<mesh position-y={-1} scale={5} rotation-x={-Math.PI * 0.5}>
									<planeGeometry args={[100, 100]} />
									<meshStandardMaterial color='white' />
								</mesh>
							</>
						</Canvas>
					</Stack>
				))}
			</Grid2>
		</Stack>
	);
}

export default App;
