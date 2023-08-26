package main

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/pkg/errors"

	"github.com/mattermost/mattermost-server/v6/model"
)

const ProjectsKVKey = "projects"

type Project struct {
	ID   string
	Name string
}

func (p *Plugin) GetProjects() ([]*Project, error) {
	b, err := p.GetProjectsBlob()
	if err != nil {
		return nil, err
	}

	projects := []*Project{}
	err = json.Unmarshal(b, &projects)
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (p *Plugin) GetProjectsBlob() ([]byte, error) {
	b, appErr := p.API.KVGet(ProjectsKVKey)
	if appErr != nil && !strings.Contains(appErr.Error(), "not found") {
		return nil, appErr
	}

	if len(b) == 0 {
		return []byte("[]"), nil
	}

	return b, nil
}

func (p *Plugin) CreateProject(name string) (*Project, error) {
	if name == "" {
		return nil, errors.New("Cannot create project with no name")
	}

	projects, err := p.GetProjects()
	for _, proj := range projects {
		if proj.Name == name {
			return nil, fmt.Errorf("Project %s already exists", name)
		}
	}

	proj := &Project{
		ID:   model.NewId(),
		Name: name,
	}
	projects = append(projects, proj)

	_, err = p.SetProjectsAndGetBlob(projects)
	if err != nil {
		return nil, err
	}

	return proj, nil
}

func (p *Plugin) SetProjectsAndGetBlob(projects []*Project) ([]byte, error) {
	b, err := json.Marshal(projects)
	if err != nil {
		return nil, err
	}

	appErr := p.API.KVSet(ProjectsKVKey, b)
	if appErr != nil {
		return nil, appErr
	}

	return b, nil
}
