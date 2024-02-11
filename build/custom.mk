mock:
ifneq ($(HAS_SERVER),)
	go install github.com/golang/mock/mockgen@v1.6.0
	mockgen -destination server/trim/mock_trim/mock_transcoder.go github.com/mattermost/mattermost-plugin-mattermusic/server/trim Transcoder
endif

clean_mock:
ifneq ($(HAS_SERVER),)
	rm -rf ./server/trim/mock_trim
endif
