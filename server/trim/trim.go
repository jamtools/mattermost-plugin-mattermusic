package trim

import (
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/elastictranscoder"
	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

const mp3AudioPreset = "1351620000001-300040"

type TrimResponse struct {
	Err     error
	NewPath string
}

// subset interface of *elastictranscoder.ElasticTranscoder
type Transcoder interface {
	CreatePipeline(input *elastictranscoder.CreatePipelineInput) (*elastictranscoder.CreatePipelineOutput, error)
	CreateJob(input *elastictranscoder.CreateJobInput) (*elastictranscoder.CreateJobResponse, error)
	ReadJob(input *elastictranscoder.ReadJobInput) (*elastictranscoder.ReadJobOutput, error)
	ListPipelines(input *elastictranscoder.ListPipelinesInput) (*elastictranscoder.ListPipelinesOutput, error)
}

func Trim(logger *logrus.Logger, transcoder Transcoder, s3Path string, start, end float64) (chan TrimResponse, error) {
	bucket := "your-input-bucket"
	roleArn := "your-role-arn"

	pipelineName := "Mattermusic Trimming"

	pipelineID, err := getOrCreatePipeline(transcoder, bucket, roleArn, pipelineName)
	if err != nil {
		return nil, errors.Wrap(err, "Failed to get or create pipeline")
	}

	inputKey := s3Path
	outputKey := s3Path + ".trimmed-" + model.NewId() + ".mp3"

	resp, err := createTranscodeJob(transcoder, pipelineID, inputKey, outputKey, start, end)
	if err != nil {
		return nil, errors.Wrap(err, "Failed to create job")
	}

	logger.Infof("Job created: %s", *resp.Job.Id)

	respChannel := make(chan TrimResponse)
	go func() {
		err := pollForJobCompletion(transcoder, resp.Job.Id)
		if err != nil {
			respChannel <- TrimResponse{
				Err: err,
			}
			return
		}

		logger.Info("Trimming completed and the trimmed audio file is stored in S3.")

		respChannel <- TrimResponse{
			NewPath: outputKey,
		}
		close(respChannel)
	}()

	return respChannel, nil
}

func pollForJobCompletion(transcoder Transcoder, jobId *string) error {
	for {
		time.Sleep(10 * time.Second)
		resp, err := transcoder.ReadJob(&elastictranscoder.ReadJobInput{Id: jobId})
		if err != nil {
			return errors.Wrap(err, "Failed to read job status")
		}

		if *resp.Job.Status == "Complete" {
			return nil
		}
		if *resp.Job.Status == "Canceled" {
			return errors.Errorf("Job cancelled. id %s", *jobId)
		}

		if *resp.Job.Status == "Error" {
			errs := []string{}
			for _, output := range resp.Job.Outputs {
				errs = append(errs, *output.StatusDetail)
			}

			errorMessage := strings.Join(errs, "\n")
			return errors.Errorf("Error occurred with transcode job. id %s. %s", *jobId, errorMessage)
		}
	}
}

func createTranscodeJob(transcoder Transcoder, pipelineID, inputKey, outputKey string, start, end float64) (*elastictranscoder.CreateJobResponse, error) {
	startTime := secondsToTimeString(start)
	durationTime := secondsToTimeString(end - start)

	params := &elastictranscoder.CreateJobInput{
		Input: &elastictranscoder.JobInput{
			Key: aws.String(inputKey),
			TimeSpan: &elastictranscoder.TimeSpan{
				StartTime: aws.String(startTime),
				Duration:  aws.String(durationTime),
			},
		},
		Output: &elastictranscoder.CreateJobOutput{
			Key:      aws.String(outputKey),
			PresetId: aws.String(mp3AudioPreset),
		},
		PipelineId: aws.String(pipelineID),
	}

	resp, err := transcoder.CreateJob(params)
	if err != nil {
		return nil, errors.Wrap(err, "Failed to create job")
	}

	return resp, nil
}

func getOrCreatePipeline(transcoder Transcoder, pipelineName, bucket, roleArn string) (string, error) {
	transcoder.ListPipelines(&elastictranscoder.ListPipelinesInput{})

	params := &elastictranscoder.CreatePipelineInput{
		InputBucket:  aws.String(bucket),
		OutputBucket: aws.String(bucket),
		Role:         aws.String(roleArn),
		Name:         aws.String(pipelineName),
	}

	resp, err := transcoder.CreatePipeline(params)
	if err != nil {
		return "", err
	}

	return *resp.Pipeline.Id, nil
}

func GetTranscoderService() (*elastictranscoder.ElasticTranscoder, error) {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"),
	})
	if err != nil {
		return nil, errors.Wrap(err, "failed to create AWS session")
	}

	return elastictranscoder.New(sess), nil
}

func secondsToTimeString(seconds float64) string {
	d := time.Duration(seconds * float64(time.Second))
	hours := d / time.Hour
	d -= hours * time.Hour
	minutes := d / time.Minute
	d -= minutes * time.Minute
	remainingSeconds := float64(d) / float64(time.Second)

	return fmt.Sprintf("%02d:%02d:%05.1f", hours, minutes, remainingSeconds)
}
