package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"

	"github.com/mattermost/mattermost-server/v5/plugin"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	if true {
		// fmt.Fprint(w, "Cuttin' it short")
		// return
	}
	switch r.URL.Path {
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
	w.Write(b)
}

// handleCreateProject creates a new project
func (p *Plugin) handleCreateProject(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
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
	w.Write(b)
}

// handleTrim trims an audio file based on start and end params
func (p *Plugin) handleTrim(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Error marshaling project response: "+err.Error())
		return
	}

	// r.ParseMultipartForm(0)
	// file := r.Form.Get("file")

	w.WriteHeader(200)
	w.Write(data)
}
