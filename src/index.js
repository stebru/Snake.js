import game from './game.js';

if ((window.location.port === 80 || !window.location.port) && window.location.protocol !== 'https:') {
	window.location.protocol = 'https:';
}

game.start();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js').then(function(ok) {
		console.log('SW registered', ok);
	}).catch(function(err) {
		console.log('SW error', err);
	});
}
