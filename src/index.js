import game from './game.js';

game.start();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js').then(function(ok) {
		console.log('SW registered', ok);
	}).catch(function(err) {
		console.log('SW error', err);
	});
}
