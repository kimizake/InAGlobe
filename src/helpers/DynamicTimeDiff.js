// datetime is set to -- ISO 8601 - RFC 3339 calendar date extended format Example: 2019-11-12T19:16:49+0000

export default function dynamicTimeDiff(dateBefore, dataAfter = new Date(), isDue = false) {

    const format = (value, unit) => `${value} ${unit}${value === 1 ? "" : "s"} ${isDue ? "left" : "ago"}`
    
    var diffSeconds = (dataAfter.getTime() - dateBefore.getTime()) / 1000
    if (diffSeconds < 60) {
        return format(Math.floor(diffSeconds), "sec")
    }

    var diffMins = diffSeconds / 60
    if (diffMins < 60) {
        return format(Math.floor(diffMins), "min")
    }

    var diffHours = diffMins / 60
    if (diffHours < 24) {
        return format(Math.floor(diffHours), "hour")
    }

    var diffDays = diffHours / 24
    if (diffDays < 365) {
        return format(Math.floor(diffDays), "day")
    }

    return format(Math.floor(diffDays / 365), "year")
}