package main

import (
	"strings"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin"
)

var extensionMap = map[string]string{
	"aac": "audio/aac",
	"mp3": "audio/mp3",
}

func getMimeType(f *model.FileInfo) string {
	if f == nil {
		return ""
	}

	if f.MimeType != "" {
		return f.MimeType
	}

	return extensionMap[f.Extension]
}

func (p *Plugin) MessageWillBePosted(c *plugin.Context, post *model.Post) (*model.Post, string) {
	if strings.Contains(post.Message, "#media-upload") {
		return nil, ""
	}

	if len(post.FileIds) == 0 {
		return nil, ""
	}

	// Only apply hashtag on root posts
	if post.RootId != "" {
		return nil, ""
	}

	f, err := p.API.GetFileInfo(post.FileIds[0])
	if err != nil {
		return nil, ""
	}

	mime := getMimeType(f)
	if strings.Contains(mime, "audio") || strings.Contains(mime, "video") {
		toAdd := "\n"
		if post.Message == "" {
			toAdd += f.Name
		}
		toAdd += " #media-upload"
		post.Message += toAdd
		post.Hashtags += toAdd
		return post, ""
	}

	return nil, ""
}

const spotifyTheme = `{"sidebarBg":"#121212","sidebarText":"#ffffff","sidebarUnreadText":"#ffffff","sidebarTextHoverBg":"#282828","sidebarTextActiveBorder":"#1bba56","sidebarTextActiveColor":"#1bba56","sidebarHeaderBg":"#121212","sidebarHeaderTextColor":"#ffffff","onlineIndicator":"#1bba56","awayIndicator":"#e0b333","dndIndicator":"#f74343","mentionBg":"#1bba56","mentionBj":"#1bba56","mentionColor":"#ffffff","centerChannelBg":"#181818","centerChannelColor":"#9d9d9d","newMessageSeparator":"#1bba56","linkColor":"#1bba56","buttonBg":"#1bba56","buttonColor":"#ffffff","errorTextColor":"#fd5960","mentionHighlightBg":"#184127","mentionHighlightLink":"#ffffff","codeTheme":"monokai"}`

func (p *Plugin) UserHasBeenCreated(c *plugin.Context, user *model.User) {
	pref := model.Preference{
		Category: "theme",
		Name:     "",
		UserId:   user.Id,
		Value:    spotifyTheme,
	}

	err := p.API.UpdatePreferencesForUser(user.Id, model.Preferences{pref})
	if err != nil {
		p.API.LogError(err.Error())
	}
}
