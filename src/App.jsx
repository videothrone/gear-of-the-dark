import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
/* import Footer from './components/Footer'; */
import Router from './Router';

export default function App() {
	return (
		<BrowserRouter>
			<div className="site-wrapper">
				<Header />
				<main className="site-content content-padding">
					<Router />
				</main>
				{/* <Footer /> */}
			</div>
		</BrowserRouter>
	);
}
