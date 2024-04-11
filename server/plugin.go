package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"

	"github.com/mattermost/mattermost/server/public/plugin"
	"github.com/pkg/errors"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin
	configurationLock sync.RWMutex
	configuration     *configuration

	BotUserID string
}

func (p *Plugin) OnActivate() error {
	if p.API.GetConfig().ServiceSettings.SiteURL == nil {
		return errors.New("the SiteURL not set")
	}

	return nil
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/assets/iframe_api", "/assets/iframe_widget_api.js":
		p.handleAssets(w, r)
		return
	case "/projects":
		switch r.Method {
		case http.MethodGet:
			p.handleGetProjects(w, r)
			return
		case http.MethodPost:
			p.handleCreateProject(w, r)
			return
		default:
			fmt.Fprint(w, "Hello, world!")
		}
	case "/trim":
		p.handleTrim(w, r)
		return
	}
}

// handleGetProjects fetches all projects
func (p *Plugin) handleGetProjects(w http.ResponseWriter, r *http.Request) {
	b, err := p.GetProjectsBlob()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error fetching projects: "+err.Error())
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(200)
	_, _ = w.Write(b)
}

// handleCreateProject creates a new project
func (p *Plugin) handleCreateProject(w http.ResponseWriter, r *http.Request) {
	b, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error reading request body: "+err.Error())
		return
	}

	proj := &Project{}
	err = json.Unmarshal(b, proj)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error unmarhsaling request body's project: "+err.Error())
		return
	}

	proj, err = p.CreateProject(proj.Name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error creating project: "+err.Error())
		return
	}

	b, err = json.Marshal(proj)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error marshaling project response: "+err.Error())
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(200)
	_, _ = w.Write(b)
}

// handleTrim trims an audio file based on start and end params
func (p *Plugin) handleTrim(w http.ResponseWriter, r *http.Request) {
	data, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error marshaling project response: "+err.Error())
		return
	}

	// r.ParseMultipartForm(0)
	// file := r.Form.Get("file")

	w.WriteHeader(200)
	_, _ = w.Write(data)
}
