---
title: "Exploring Open Location Code"
date: 2023-03-28T09:34:17+02:00
tags:
- geo
- mapping
- groovy
---

![](/img/misc/eiffel-tower-plus-code.png)

When using Google Maps, you might have seen those strange little codes, as in the screenshot above.
This is a _plus code_, or to use the more official name, an **Open Location Code**.
It's a way to encode a location in a short and (somewhat) memorable form.

In countries like France, every house has an official address, so you can easily receive letters or get some parcel delivered. But there are countries where no such location system exists, so you have to resort to describing where you live (take this road, turn right after the red house, etc.)

Of coursse, you could use GPS coordinates, but that's not very convenient to share, and nobody could remember a precise address. So there have been several attemps at creating systems that represent any location in the world,
like [GeoHash](http://geohash.org/), [MapCode](https://www.mapcode.com/), and other proprietary systems like 3-words.

Out of curiosity, I wanted to play with this geo-encoding approach, and decided to spend a few minutes playing with the available Java library (available on [Maven Central](https://central.sonatype.com/artifact/com.google.openlocationcode/openlocationcode/1.0.4)), but using [Apache Groovy](https://groovy-lang.org/).

You'll find more links on the topic at the end of this article.

## Playing with plus codes in Groovy

Here's a little script that shows the library in action:

```groovy
@Grab("com.google.openlocationcode:openlocationcode:1.0.4")
import com.google.openlocationcode.OpenLocationCode

// Eiffel Tower
def (lat, lon) = [48.8584, 2.29447]

def eiffelTowerPlusCode = OpenLocationCode.encode(lat, lon)
println "Eiffel Tower +code: ${eiffelTowerPlusCode}"

def decoded = OpenLocationCode.decode('8FW4V75V+9Q')
println "Original coord: ${decoded.centerLatitude}, ${decoded.centerLongitude}"
```
(You can play and run the above script in the [Groovy Web Console](https://gwc-experiment.appspot.com/?g=groovy_4_0&gist=4176e0ad13b396001c92ab5cd584b3d8))

## More information

* The official [Open Location Code website](https://maps.google.com/pluscodes/)
* The project [open-location-code project on Github](https://github.com/google/open-location-code) that provides implementations of the algorithm in various programming languages
* A [comparison](https://github.com/google/open-location-code/wiki/Evaluation-of-Location-Encoding-Systems) of different geocoding / geohashing systems
* The French wikipedia [page on Open Location Code](https://fr.wikipedia.org/wiki/Open_Location_Code) shows visually how the world map is cut in smaller boxes, as you zoom in, and takes the example of the Eiffel Tower like in my script above
* For reference, the English wikipedia [page](https://en.wikipedia.org/wiki/Open_Location_Code), but it's a little less detailed and visual