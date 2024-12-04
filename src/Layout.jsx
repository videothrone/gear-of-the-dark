import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AudioPlayer from './components/AudioPlayer';
import { AudioContext } from './contexts/audioContext';

export default function Layout() {
	const [activeEpisode, setActiveEpisode] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlay = (episode) => {
		setActiveEpisode(episode);
		setIsPlaying(true);
	};

	const handlePause = () => {
		setIsPlaying(false);
	};

	const handleResume = () => {
		setIsPlaying(true);
	};

	// Context Provider für die Audio-Funktionen
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
						onClose={() => setActiveEpisode(null)}
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
