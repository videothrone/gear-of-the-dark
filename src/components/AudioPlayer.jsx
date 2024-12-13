import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
	FaCaretDown,
	FaCaretUp,
	FaPlay,
	FaPause,
	FaVolumeMute,
	FaVolumeUp,
	FaForward,
	FaBackward,
} from 'react-icons/fa';

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
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const audioRef = useRef(null);

	const getAudioUrl = (episode) => {
		if (episode.enclosure && episode.enclosure.url) {
			return episode.enclosure.url;
		}
		console.error('Konnte keine Audio-URL finden:', episode);
		return '';
	};

	const audioUrl = getAudioUrl(episode);

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

	const skip = (seconds) => {
		if (audioRef.current) {
			audioRef.current.currentTime += seconds;
		}
	};

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

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

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
		}
	};

	const handleLoadedMetadata = () => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration);
		}
	};

	const handleProgressClick = (e) => {
		const progressBar = e.currentTarget;
		const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
		const progressBarWidth = progressBar.offsetWidth;
		const newTime = (clickPosition / progressBarWidth) * duration;

		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			const newMutedState = !isMuted;
			setIsMuted(newMutedState);
			audioRef.current.muted = newMutedState;
		}
	};

	if (!audioUrl) {
		return <div>Fehler: Keine Audio-URL gefunden</div>;
	}

	return (
		<div
			className={`audio-player ${isMinimized ? 'audio-player--minimized' : ''}`}
		>
			<img
				src={episode.episodeImage}
				alt={episode.title}
				className="audio-player__image"
			/>
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
				<div className="audio-player__audio">
					<audio
						ref={audioRef}
						src={audioUrl}
						onTimeUpdate={handleTimeUpdate}
						onLoadedMetadata={handleLoadedMetadata}
					>
						<track kind="captions" src="" label="Untertitel" />
					</audio>
					{!isMinimized && (
						<>
							<div className="audio-player__controls">
								<button
									onClick={() => skip(-30)}
									aria-label="30 Sekunden zurück"
									className="audio-player__skip-button"
								>
									<FaBackward />
									<span>-30s</span>
								</button>
								<button
									onClick={togglePlay}
									aria-label={isPlaying ? 'Pause' : 'Abspielen'}
									className="audio-player__play-button"
								>
									{isPlaying ? <FaPause /> : <FaPlay />}
								</button>
								<button
									onClick={() => skip(30)}
									aria-label="30 Sekunden vor"
									className="audio-player__skip-button"
								>
									<FaForward />
									<span>+30s</span>
								</button>
							</div>
							<div className="audio-player__progress">
								<div
									className="audio-player__progress-bar"
									onClick={handleProgressClick}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											handleProgressClick(e);
										}
									}}
									role="slider"
									tabIndex={0}
									aria-label="Audio-Fortschritt"
									aria-valuemin={0}
									aria-valuemax={duration}
									aria-valuenow={currentTime}
								>
									<div
										className="audio-player__progress-filled"
										style={{ width: `${(currentTime / duration) * 100}%` }}
									></div>
								</div>
								<div className="audio-player__time">
									<span>{formatTime(currentTime)}</span>
									<span>{formatTime(duration)}</span>
								</div>
							</div>
							<div className="audio-player__sound">
								<div className="audio-player__speed">
									<label htmlFor="speed" className="visually-hidden">
										Geschwindigkeit:
									</label>
									<select
										id="speed"
										value={speed}
										onChange={handleSpeedChange}
										className="audio-player__speed-select"
									>
										<option value="0.5">0.5x</option>
										<option value="1">1x</option>
										<option value="1.5">1.5x</option>
										<option value="2">2x</option>
									</select>
								</div>
								<div className="audio-player__volume">
									<button
										className="audio-player__volume-button"
										onClick={toggleMute}
										aria-label={isMuted ? 'Stummschalten' : 'Stummgeschaltet'}
									>
										{isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
									</button>
									<input
										type="range"
										id="volume"
										min="0"
										max="1"
										step="0.1"
										value={isMuted ? 0 : volume}
										onChange={handleVolumeChange}
										className="audio-player__volume-slider"
									/>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
