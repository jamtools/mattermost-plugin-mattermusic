package main

import (
	"testing"

	"github.com/stretchr/testify/require"
)

const sampleYoutubeIframeAPIScript = `var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/97ea7458\/www-widgetapi.vflset\/www-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}var YT;if(!window["YT"])YT={loading:0,loaded:0};var YTConfig;if(!window["YTConfig"])YTConfig={"host":"https://www.youtube.com"};
if(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;for(var i=0;i<l.length;i++)try{l[i]()}catch(e$0){}};YT.setConfig=function(c){for(var k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",n)}var b=
document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)})()};`

const injectedYoutubeIframeAPIScript = `var scriptUrl = 'http://myserver.com/plugins/mattermusic/assets/iframe_widget_api.js?original=https%3A%2F%2Fwww.youtube.com%2Fs%2Fplayer%2F97ea7458%2Fwww-widgetapi.vflset%2Fwww-widgetapi.js';try{var ttPolicy=window.trustedTypes.createPolicy("youtube-widget-api",{createScriptURL:function(x){return x}});scriptUrl=ttPolicy.createScriptURL(scriptUrl)}catch(e){}var YT;if(!window["YT"])YT={loading:0,loaded:0};var YTConfig;if(!window["YTConfig"])YTConfig={"host":"https://www.youtube.com"};
if(!YT.loading){YT.loading=1;(function(){var l=[];YT.ready=function(f){if(YT.loaded)f();else l.push(f)};window.onYTReady=function(){YT.loaded=1;for(var i=0;i<l.length;i++)try{l[i]()}catch(e$0){}};YT.setConfig=function(c){for(var k in c)if(c.hasOwnProperty(k))YTConfig[k]=c[k]};var a=document.createElement("script");a.type="text/javascript";a.id="www-widgetapi-script";a.src=scriptUrl;a.async=true;var c=document.currentScript;if(c){var n=c.nonce||c.getAttribute("nonce");if(n)a.setAttribute("nonce",n)}var b=
document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)})()};`

func TestInjectIframeScriptURL(t *testing.T) {
	s := sampleYoutubeIframeAPIScript
	script, err := injectIframeScriptURL(s, "http://myserver.com")
	require.NoError(t, err)

	expected := injectedYoutubeIframeAPIScript
	require.Equal(t, expected, script)
}
