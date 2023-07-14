window.interdeal = {
    "sitekey": "4a7384545f15baf5c309532a2ac20f05",
    "Position": "Left",
    "Menulang": "EN",
    "domains": {
        "js": "https://cdn.equalweb.com/",
        "acc": "https://access.equalweb.com/"
    },
    "btnStyle": {
        "vPosition": [
            "90%",
            null
        ],
        "scale": [
            "0.6",
            "0.6"
        ],
        "color": {
            "main": "#267ab5",
            "second": ""
        },
        "icon": {
            "type": 11,
            "shape": "circle",
            "outline": false
        }
    }
};
(function(doc, head, body){
	var coreCall             = doc.createElement('script');
	coreCall.src             = window.interdeal.domains.js + 'core/4.4.2/accessibility.js';
	coreCall.defer           = true;
	coreCall.integrity       = 'sha512-A9+ASEqwwTHkr8277jm4B3aoLL+QbUDSfgKqA6M7tWbu/Vlde4BsHZuFx8YFnSPdbVa6RJsb8xQ4+apAk2lkww==';
	coreCall.crossOrigin     = 'anonymous';
	coreCall.setAttribute('data-cfasync', 'true' );
	body? body.appendChild(coreCall) : head.appendChild(coreCall);
})(document, document.head, document.body);