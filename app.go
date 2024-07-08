package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"

	"github.com/kkdai/youtube/v2"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Downloader function
func (a *App) Downloader(videoURL string, path string) string {
	client := &youtube.Client{}
	video, err := client.GetVideo(videoURL)
	if err != nil {
		return fmt.Sprintf("Failed to get video info: %v", err)
	}

	videoFormat := findFormatByItag(video.Formats, 18) // itag 18 for example, you can make it dynamic as required
	if videoFormat == nil {
		return fmt.Sprintf("Could not find video format with itag %d", 18)
	}

	// Get the video title and sanitize it for use as a filename
	title := sanitizeFilename(video.Title)

	filename := fmt.Sprintf("%s/%s.mp4", path, title)

	fmt.Println("Downloading video...")
	err = downloadStream(client, video, videoFormat, filename)
	if err != nil {
		return fmt.Sprintf("Failed to download video: %v", err)
	}

	fmt.Println("Video downloaded successfully as", filename)
	return "Download Complete"
}

func downloadStream(client *youtube.Client, video *youtube.Video, format *youtube.Format, filename string) error {
	stream, _, err := client.GetStream(video, format)
	if err != nil {
		return err
	}
	defer stream.Close()

	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(file, stream)
	if err != nil {
		return err
	}

	return nil
}

func findFormatByItag(formats youtube.FormatList, itagNo int) *youtube.Format {
	for _, format := range formats {
		if format.ItagNo == itagNo {
			return &format
		}
	}
	return nil
}

// sanitizeFilename sanitizes a string to be a valid filename
func sanitizeFilename(name string) string {
	// Replace invalid characters with an underscore
	re := regexp.MustCompile(`[<>:"/\\|?*\x00-\x1F]`)
	sanitized := re.ReplaceAllString(name, "_")
	// Remove any leading or trailing spaces
	sanitized = strings.TrimSpace(sanitized)
	// Limit the length of the filename to avoid filesystem limitations
	if len(sanitized) > 255 {
		sanitized = sanitized[:255]
	}
	return sanitized
}
