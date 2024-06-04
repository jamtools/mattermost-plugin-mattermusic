package main

import (
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"

	"github.com/mattermost/mattermost-server/v6/model"

	"github.com/mattermost/mattermost-plugin-mattermusic/server/trim"
)

type trimPayload struct {
	FileId string  `json:"file_id"`
	Start  float64 `json:"start"`
	End    float64 `json:"end"`
}

// handleTrim trims an audio file based on start and end params
func (p *Plugin) handleTrim(w http.ResponseWriter, r *http.Request) {
	userId := r.Header.Get("Mattermost-User-Id")
	if userId == "" {
		writeErr(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	payload := trimPayload{}
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, errors.Wrap(err, "error unmarshaling trim payload"))
		return
	}

	fileInfo, appErr := p.API.GetFileInfo(payload.FileId)
	if appErr != nil {
		writeErr(w, http.StatusInternalServerError, errors.Wrap(appErr, "error getting file info"))
		return
	}

	canReadChannel := p.API.HasPermissionToChannel(userId, fileInfo.ChannelId, model.PermissionReadChannel)
	if !canReadChannel {
		writeErr(w, http.StatusUnauthorized, errors.Wrap(appErr, "you don't have access to this file"))
		return
	}

	s3Path, err := getS3PathForFile(payload.FileId)
	if err != nil {

	}

	transcoder, err := trim.GetTranscoderService()
	if err != nil {

	}

	logger := logrus.New()
	cErr, err := trim.Trim(logger, transcoder, s3Path, payload.Start, payload.End)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, errors.Wrap(err, "error trimming file"))
		return
	}

	go func() {
		trimResponse := <-cErr
		if trimResponse.Err != nil {
			broadcastErrorMessage(userId, fileInfo, trimResponse.Err.Error())
		} else {
			newPath := trimResponse.NewPath
			newFileInfo, err := p.persistNewFile(userId, fileInfo, newPath, payload)
			if err != nil {
				broadcastErrorMessage(userId, fileInfo, errors.Wrap(err, "failed to persist new trimmed file").Error())
				return
			}

			broadcastSuccessMessage(userId, newFileInfo, "The file is trimmed")
		}
	}()
}

func (p *Plugin) persistNewFile(userId string, fileInfo *model.FileInfo, newPath string, payload trimPayload) (*model.FileInfo, error) {
	// somehow create a new file for the thing in s3

	return nil, errors.New("persistNewFile not implemented")
}

func broadcastErrorMessage(userId string, fileInfo *model.FileInfo, message string) {

}

func broadcastSuccessMessage(userId string, fileInfo *model.FileInfo, message string) {

}

func getS3PathForFile(fileId string) (string, error) {
	// do db query
	return "/path/to/file", nil
}
