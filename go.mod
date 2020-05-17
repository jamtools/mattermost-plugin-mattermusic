module github.com/mattermost/mattermost-plugin-mattermusic

go 1.12

replace github.com/mattermost/mattermost-server/v5 => ../../mattermost/mattermost-server

require (
	github.com/mattermost/mattermost-server/v5 v5.0.0-00010101000000-000000000000
	// github.com/mattermost/mattermost-server/v5 v5.22.2 replace
	github.com/mholt/archiver/v3 v3.3.0
	github.com/pkg/errors v0.9.1
	github.com/stretchr/testify v1.5.1
)
