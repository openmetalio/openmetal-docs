import type { ClientModule } from '@docusaurus/types';

const isProd = process.env.NODE_ENV === 'production';
const isCrawl = typeof navigator !== 'undefined' && /bot|crawler|spider|crawling/i.test( navigator.userAgent );
const customFields = {
	googleAnalyticId: 'UA-213530121-1',
	trackers: [
		{
			name: 'hs-script-loader',
			disableOnCrawl: true,
			src: '//js.hs-scripts.com/5297785.js?businessUnitId=188922',
			innerHTML: '',
			async: true,
			defer: true,
			disableOnDev: true,
		},
		{
			name: 'googleAnalytics',
			disableOnCrawl: true,
			src: 'https://www.googletagmanager.com/gtag/js',
			innerHTML: '',
			async: true,
			defer: true,
			disableOnDev: true,
		},
	]
};

const trackers = customFields.trackers || [];
const googleAnalyticId = customFields.googleAnalyticId || '';

// If we're loading GA we need to preconnect to google-analytics.
if ( trackers.find( ( tracker ) => tracker.name === 'googleAnalytics' ) ) {
	trackers.push( {
		name: 'googleAnalyticsTracker',
		disableOnCrawl: true,
		src: '',
		innerHTML: `
			window.dataLayer = window.dataLayer || [];
			function gtag(){window.dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', '${ googleAnalyticId }');
		`,
		async: false,
		defer: false,
		disableOnDev: true,
	} );
}

// Loop through all trackers and add them to the head.
trackers.forEach( ( tracker ) => {
	// If user agent is a bot/crawler, don't load the tracker
	if ( tracker.disableOnCrawl && isCrawl ) {
		return;
	}

	// If we're not in production, don't load the tracker
	if ( ! isProd && tracker.disableOnDev ) {
		console.log( `Tracker ${ tracker.name } disabled on dev` );
		return;
	}

	const trackerScript = document.getElementById( tracker.name );

	// if tracker is not found, create it
	if ( !trackerScript ) {
		const script = document.createElement( 'script' );
		script.id = tracker.name;
		script.async = tracker.async;
		script.defer = tracker.defer;

		if ( tracker.src ) {
			script.src = tracker.src;
		} else {
			script.innerHTML = tracker.innerHTML;
		}

		document.head.appendChild( script );
	}
} );

function gtagOnRouteUpdate ( { location, previousLocation } ) {
	if ( previousLocation && location.pathname !== previousLocation.pathname ) {
		setTimeout( () => {
			window[ 'gtag' ]( 'config', googleAnalyticId, {
				page_path: location.pathname,
				page_title: document.title,
				send_page_view: false,
			} );

			window[ 'gtag' ]( 'event', 'page_view', {
				page_title: document.title,
				page_location: window.location.href,
				page_path: location.pathname,
			} );
		}, 100 );
	}
}

const clientModule: ClientModule = {
	onRouteUpdate ( { location, previousLocation } ) {
		if ( window[ 'gtag' ] ) {
			gtagOnRouteUpdate( { location, previousLocation } );
		}
	}
}

export default clientModule;