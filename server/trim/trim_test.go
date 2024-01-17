package trim_test

import (
	"errors"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/elastictranscoder"
	"github.com/golang/mock/gomock"
	"github.com/mattermost/mattermost-plugin-mattermusic/server/trim"
	"github.com/mattermost/mattermost-plugin-mattermusic/server/trim/mock_trim"
	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/require"
)

func TestTrim(t *testing.T) {
	type args struct {
		logger     *logrus.Logger
		transcoder trim.Transcoder
		s3Path     string
		start      float64
		end        float64
	}

	tests := []struct {
		name          string
		want          chan trim.TrimResponse
		wantErr       string
		runAssertions func(transcoder *mock_trim.MockTranscoder)
	}{
		{
			name: "error listing pipelines",
			runAssertions: func(transcoder *mock_trim.MockTranscoder) {
				listOutput := &elastictranscoder.ListPipelinesOutput{}
				transcoder.EXPECT().ListPipelines(gomock.Any()).Return(listOutput, errors.New("some aws pipeline list error"))
			},
			wantErr: "failed to list pipelines",
		},
		{
			name: "found pipeline in list",
			runAssertions: func(transcoder *mock_trim.MockTranscoder) {
				listOutput := &elastictranscoder.ListPipelinesOutput{
					Pipelines: []*elastictranscoder.Pipeline{
						{
							Id:   aws.String(""),
							Name: aws.String(trim.TRIMMER_PIPELINE_NAME),
						},
					},
				}
				transcoder.EXPECT().ListPipelines(gomock.Any()).Return(listOutput, nil)
			},
			wantErr: "failed to list pipelines",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()
			transcoder := mock_trim.NewMockTranscoder(ctrl)

			logger := logrus.New()
			s3Path := ""

			start := 2.0
			end := 6.0

			tt.runAssertions(transcoder)

			got, err := trim.Trim(logger, transcoder, s3Path, start, end)
			if tt.wantErr != "" {
				require.Error(t, err)
				require.Contains(t, err.Error(), tt.wantErr)
				return
			}

			require.NoError(t, err)
			require.NotNil(t, got)
		})
	}
}
