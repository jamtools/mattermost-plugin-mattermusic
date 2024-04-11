package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/pkg/errors"
)

const beginning = `var scriptUrl = '`

func (p *Plugin) handleAssets(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/assets/iframe_api" {
		script, err := p.getYoutubeIframeAPIScript()
		if err != nil {
			errMsg := errors.Wrap(err, "error getting youtube iframe script").Error()
			http.Error(w, errMsg, http.StatusInternalServerError)
			return
		}

		w.Header().Add("Content-Type", "text/javascript")
		_, _ = w.Write([]byte(script))
		return
	}

	if r.URL.Path == "/assets/iframe_widget_api.js" {
		script, err := getYoutubeIframeWidgetScript(r.URL.Query().Get("original"))
		if err != nil {
			errMsg := errors.Wrap(err, "error getting youtube iframe script").Error()
			http.Error(w, errMsg, http.StatusInternalServerError)
			return
		}

		w.Header().Add("Content-Type", "text/javascript")
		_, _ = w.Write([]byte(script))
		return
	}

	http.NotFound(w, r)
}

func (p *Plugin) getYoutubeIframeAPIScript() (string, error) {
	u := "https://www.youtube.com/iframe_api"
	res, err := http.Get(u)
	if err != nil {
		return "", errors.Wrap(err, "error fetching iframe script")
	}

	defer res.Body.Close()

	b, err := io.ReadAll(res.Body)
	if err != nil {
		return "", errors.Wrap(err, "error reading iframe script response")
	}

	siteURL := p.API.GetConfig().ServiceSettings.SiteURL
	if siteURL == nil {
		return "", errors.Wrap(err, "site url not set")
	}

	s := string(b)
	script, err := injectIframeScriptURL(s, *siteURL)
	if err != nil {
		return "", err
	}

	return script, nil
}

func injectIframeScriptURL(script, siteURL string) (string, error) {
	if !strings.HasPrefix(script, beginning) {
		return "", errors.New("error finding place to inject script URL")
	}

	beginningLength := len(beginning)
	endOfScriptURL := strings.Index(script[beginningLength:], "'") + beginningLength
	scriptURL := script[beginningLength:endOfScriptURL]

	escaped := url.QueryEscape(strings.ReplaceAll(scriptURL, "\\", ""))
	newScriptURL := fmt.Sprintf("%s/plugins/mattermusic/assets/iframe_widget_api.js?original=%s", siteURL, escaped)
	replaced := strings.Replace(script, scriptURL, newScriptURL, 1)
	return replaced, nil
}

func getYoutubeIframeWidgetScript(u string) (string, error) {
	res, err := http.Get(u) //nolint
	if err != nil {
		return "", errors.Wrap(err, "error fetching iframe script")
	}

	defer res.Body.Close()

	b, err := io.ReadAll(res.Body)
	if err != nil {
		return "", errors.Wrap(err, "error reading iframe script response")
	}

	return string(b), nil
}
