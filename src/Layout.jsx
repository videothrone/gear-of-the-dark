import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import { AudioContext } from './contexts/audioContext';

export default function Layout() {
	const [activeEpisode, setActiveEpisode] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlay = useCallback((episode) => {
		setActiveEpisode(episode);
		setIsPlaying(true);
	}, []);

	const handlePause = useCallback(() => {
		setIsPlaying(false);
	}, []);

	const handleResume = useCallback(() => {
		setIsPlaying(true);
	}, []);

	const handleClose = useCallback(() => {
		setActiveEpisode(null);
		setIsPlaying(false);
	}, []);

	// Context provider for AudioPlayer
	const audioContext = {
		activeEpisode,
		isPlaying,
		onPlay: handlePlay,
		onPause: handlePause,
		onResume: handleResume,
	};

	return (
		<div className="layout">
			<AudioContext.Provider value={audioContext}>
				<Outlet />
				{activeEpisode && (
					<AudioPlayer
						episode={activeEpisode}
						onClose={handleClose}
						autoPlay={true}
						isPlaying={isPlaying}
						onPause={handlePause}
						onPlay={handleResume}
					/>
				)}
			</AudioContext.Provider>
		</div>
	);
}
