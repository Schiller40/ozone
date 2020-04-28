# Changelog
- 0.0.3: Unified styles and other resources. They can either be http(s), data or a path relative to the slide directory. Also, special styles have been removed ($contain, $cover etc.)
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
  - url `String`: url of the resource to display. Can be http://, https://, a path relative to `[slideshow]/[slide number]/` or `data:`. The mime type of the given resource HAS to match the provided `mime` key.
  - mime `String`: mimetype of the resource
  - duration `String`: duration of the slide. see `duration.md`
  - repeat `Integer` (optional, only used for video): the number of times to repeat the video. `Default: 0`
  - style `String` (optional): url.

    url of additional styling information. Path is relative to `[slideshow]/[slide number]/` directory or has to be an external resource (http(s)://). It can also be a `data:text/css...` url.
  - text `String` (optional if mime is not text/plain): URL to a text resource (relative to `[slideshow]/[slide number]/`) or a data URL

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
      "text": "data:text/plain;charset=utf-8,super%20cool%20text%20%28text%20resource%20url%20would%20work%20as%20well%29.",
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

Format of the stylesheet: text/css. The selectors are: `.image`, `.video`, `.iframe` and `.text` for their respective types. `.container` is the wrapper `div`. It is possible to place a text element over any of the other three using the `text` key in the `slideshow.json` file. This is not possible any other way. Elements are placed using `img`, `video`, `iframe` and `p` tags.
The default style (if none or an empty style tag is transmitted) is

`data:text/css;charset=utf-8,.container%7Bbackground-color%3A%23000%7D.image%2C.video%7Bposition%3Aabsolute%3Bobject-fit%3Acontain%3Bwidth%3A100%25%3Bheight%3A100%25%7D.iframe%7Bposition%3Aabsolute%3Bwidth%3A100%25%3Bheight%3A100%25%3Bborder%3Anone%3Bbackground-color%3A%23fff%7D.text%7Bfont-family%3AArial%2Csans-serif%3Bmargin%3A0%3Bcolor%3A%23fff%3Bfont-size%3A6rem%3Btext-align%3Acenter%3Bposition%3Aabsolute%7D` or human-readable:
```css
.container{
  background-color: black;
}

.image, .video{
  position: absolute;
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.iframe{
  position: absolute;
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
}

.text{
  font-family: Arial, sans-serif;
  margin: 0px;
  color: white;
  font-size: 6rem;
  text-align: center;
  position: absolute;
}
```


# TODO
## 0.0.3
- stylesheets and text with data urls instead of $ signs
