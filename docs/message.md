# Changelog
- 0.0.2: start and duration is now an object within an array. Otherwise multiple slideshows would've been necessary to show the slideshow for different durations at different times/dates. Also added support for additional styling information (for images and videos)
- 0.0.1: first version

# Slideshow
Format of the file `slideshow.json` in the `[slideshow]` directory. `slideshow.json` contains all the information about the slideshow.
- name `String`: name of slideshow
- start `String`: start point of the slideshow as cron syntax strig
- duration `String`: the duration of the slideshow start from `start`. See `duration.md` for info
- repeat: `Boolean`: wether the slideshow should repeat after the last slide if duration is not yet over
- slides `Array`: the slides in the slideshow. Type is `object`
  - name `String`: name of the slide
  - url `String`: url of the resource to display. Can be http://, https://, or a path relative to `[slideshow]/[slide number]/` to ensure proper containerisation. The mime type of the given resource HAS to match the provided `mime` key.
  - mime `String`: mimetype of the resource
  - duration `String`: duration of the slide. see `duration.md`
  - repeat `Integer` (optional, only used when `duration` is set to `auto`): the number of times to repeat the slide. `Default: 0`
  - style `String` (optional): ["$contain" | "$cover" | "$strech" | "$center" | [url]].

    url of additional styling information, see below for details. Path is relative to `[slideshow]/[slide number]/` directory or has to be an external resource (http(s)://). Only applicable to mime type text, video and image, whereas text cannot have a special option.

    $contain shows the whole resource, scaled to the maximum. $cover makes sure there is no letterboxing or pillarboxing by scaling the resource up. $stretch stretches the image to the bounds, not preserving the aspect ratio. $center centers the image horizontally and vertically, not scaling it at all (zoom 1:1).

    To combine one option with css, use this syntax: `[option]$[url]`, e.g. `$cover|style.css`. This is necessary, if $cover or $contain shall be used in conjunction with a custom style. Filenames with "|" or "$" are not allowed.
  - text `String` (optional if mime is not text): URL to a text resource or plain text. If it is plain text, a dollar sign at the start indicates that this is not a URL.

## example
```json
{
  "id": "gigigikdjhgdhgdnhgsdfd",
  "spec_version": "0.0.2",
  "name": "My awesome slideshow",
  "timing": [
    {
      "start": "0 14 * * 0", // cron syntax. see sheduling.md
      "duration": "3h 00min",
    }
  ],
  "recipients": [],
  "repeat": false,
  "slides": [
    {
      "name": "my awesome image",
      "url": "https://example.com/image.png",
      "duration": "20min",
      "mime": "image/png",
      "text": "$super cool text (text resource url would work as well). The dollar-sign at the beginning is not visible and indicates that this is not a resource locator.",
      "style": "style.css"
    },
    {
      "name": "my awesome video",
      "url": "https://example.com/video.mp4",
      "duration": "auto", // only on mimetype group video
      "repeat": 3, // repeat the video 3 times before moving on
      "mime": "video/mp4"
    },
    {
      "name": "my awesome text",
      "text": "text.txt",
      "duration": "auto",
      "mime": "text/plain",

    }
  ]
}
```

# Styling of resources (images, videos, iframe, plain text)

Format of the stylesheet: text/css. The selectors are: `.image`, `.video`, `.iframe` and `.text` for their respective types. `.container` is the wrapper `div`. It is possible to place a text element over any of the other three using the `text` key in the `slideshow.json` file. This is not possible any other way. Elements are placed using `img`, `video`, `iframe` and `p` tags. If not set, the following defaults will be applied:
- image: `"$contain"`
- video: `"$contain"`
- iframe:
  - width: 100vw
  - height: 100vh
  - border: none
- text:
  - font-family: Arial
  - font-size: 8rem
  - margin: 0px
  - color: white
  - text-align: center
- container:
  - background-color: black
  - width: 100vw
  - height: 100vh
  - overflow: hidden
  - display: flex
  - justify-content: center
  - align-items: center
