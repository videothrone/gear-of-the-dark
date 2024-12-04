import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './views/Home';
import About from './views/About';
import Archive from './views/Archive';
import Episode from './views/Episode';
import NotFound from './views/NotFound';

export default function Router() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/archive" element={<Archive />} />
				<Route path="/episode/:guid" element={<Episode />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}
