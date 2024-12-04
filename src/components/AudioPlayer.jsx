import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

export default function AudioPlayer({
	episode,
	onClose,
	autoPlay,
	isPlaying,
	onPause,
	onPlay,
}) {
	const [volume, setVolume] = useState(1);
	const [speed, setSpeed] = useState(1);
	const [isMinimized, setIsMinimized] = useState(false);
	const audioRef = useRef(null);

	const getAudioUrl = (episode) => {
		if (episode.enclosure && episode.enclosure.url) {
			return episode.enclosure.url;
		}
		console.error('Konnte keine Audio-URL finden:', episode);
		return '';
	};

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

	const audioUrl = getAudioUrl(episode);

	/**
	 * When the audio element is initialized, the current progress of the audio
	 * player is read from a cookie and set to the audio player. If autoplay is
	 * true, the audio player is started.
	 */
	useEffect(() => {
		if (audioRef.current) {
			const savedTime = Cookies.get(`audioTime-${episode.guid}`);

			if (savedTime) {
				audioRef.current.currentTime = parseFloat(savedTime);
			}

			if (autoPlay) {
				audioRef.current.play();
			}
		}
	}, [episode.guid, autoPlay]);

	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	}, [isPlaying]);

	/**
	 * Every 5 seconds, the current progress of the audio player
	 * is saved in a cookie. If the audio player is paused,
	 * the interval is cleared.
	 */
	useEffect(() => {
		const interval = setInterval(() => {
			if (audioRef.current && isPlaying) {
				Cookies.set(`audioTime-${episode.guid}`, audioRef.current.currentTime);
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [isPlaying, episode.guid]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onClose]);

	const togglePlay = () => {
		if (isPlaying) {
			onPause();
		} else {
			onPlay();
		}
	};

	const handleVolumeChange = (e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const handleSpeedChange = (e) => {
		const newSpeed = parseFloat(e.target.value);
		setSpeed(newSpeed);
		if (audioRef.current) {
			audioRef.current.playbackRate = newSpeed;
		}
	};

	const skip = (seconds) => {
		if (audioRef.current) {
			audioRef.current.currentTime += seconds;
		}
	};

	if (!audioUrl) {
		return <div>Fehler: Keine Audio-URL gefunden</div>;
	}

	return (
		<div
			className={`audio-player ${isMinimized ? 'audio-player--minimized' : ''}`}
		>
			<div className="audio-player__content">
				<h3 className="audio-player__title">{episode.title}</h3>
				<div className="audio-player__header-buttons">
					<button
						className="audio-player__minimize"
						onClick={toggleMinimize}
						aria-label={isMinimized ? 'Player maximieren' : 'Player minimieren'}
					>
						{isMinimized ? <FaCaretUp /> : <FaCaretDown />}
					</button>
					<button
						className="audio-player__close"
						onClick={onClose}
						aria-label="Player schließen"
					>
						&times;
					</button>
				</div>
				<audio ref={audioRef} src={audioUrl}>
					<track kind="captions" src="" label="Untertitel" />
				</audio>
				{!isMinimized && (
					<>
						<div className="audio-player__controls">
							<button onClick={() => skip(-30)} aria-label="30 Sekunden zurück">
								-30s
							</button>
							<button
								onClick={togglePlay}
								aria-label={isPlaying ? 'Pause' : 'Abspielen'}
							>
								{isPlaying ? 'Pause' : 'Abspielen'}
							</button>
							<button onClick={() => skip(30)} aria-label="30 Sekunden vor">
								+30s
							</button>
						</div>
						<div className="audio-player__volume">
							<label htmlFor="volume">Lautstärke:</label>
							<input
								type="range"
								id="volume"
								min="0"
								max="1"
								step="0.1"
								value={volume}
								onChange={handleVolumeChange}
							/>
						</div>
						<div className="audio-player__speed">
							<label htmlFor="speed">Geschwindigkeit:</label>
							<select id="speed" value={speed} onChange={handleSpeedChange}>
								<option value="0.5">0.5x</option>
								<option value="1">1x</option>
								<option value="1.5">1.5x</option>
								<option value="2">2x</option>
							</select>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
