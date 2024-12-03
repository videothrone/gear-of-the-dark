import { Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import About from './views/About';
import Archive from './views/Archive';
import NotFound from './views/NotFound';

export default function Router() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/about" element={<About />} />
			<Route path="/archive" element={<Archive />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
