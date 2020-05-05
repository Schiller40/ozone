# Changelog
- 0.0.5: One stylesheet to rule them all, transitions
- 0.0.4: slide number in the folders starts at 0 instead of 1
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
  - url `String`: url of the resource to display. Can be http://, https://, a path relative to `[slideshow]/[slide number]/` (starting from 0) or `data:`. The mime type of the given resource HAS to match the provided `mime` key.
  - mime `String`: mimetype of the resource
  - duration `String`: duration of the slide. see `duration.md`
  - repeat `Integer` (optional, only used for video): the number of times to repeat the video. `Default: 0`
  - text `String` (optional if mime is not text/plain): URL to a text resource (relative to `[slideshow]/[slide number]/`) or a data URL
  - transition `String` (optional): name of the transition to this slide. the applied classes are `[name]`

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
      "transition": {
        "name": "fade",
        "mode": "simultaneous"
      }
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
      "mime": "text/plain"

    }
  ]
}
```

# Styling of resources (images, videos, iframe, plain text)

Format of the stylesheet: text/css. One stylesheet called `style.css` has to be located in the slideshow root-directory. The structure is like this:
- `div.wrapper#wrapper-[no]`
  - `div.slide#slide-[no]` (This element is removed and added with each slide change to make the transition possible. Other classes will be added to this element during the transition phases)
    - `img.image#image-[no]`
    - `video.video#video-[no]`
    - `iframe.iframe#iframe-[no]`
    - `p.text#text-[no]`

Replace `[no]` with the human-readable (counting from 1) slide number. It is possible to place a text element over any of the other three using the `text` key in the `slideshow.json` file.

## Transitions

Transitions can be self-made or a premade one can be used. Even premade ones have to be included in the stylesheet (so the length can be altered). The classes are applied to the container (`div.slide`) element according to the vue docs. `name` can be self-defined, `mode` can be `out-in`, `in-out`, or `simultaneous`. `simultaneous` is the default
