export function formatSize(kb_in, magnitude = undefined){

    if (magnitude == undefined) magnitude = getMagnitude(kb_in);
    if (magnitude < 3) return `${kb_in} KB`
    else if (magnitude < 6) return `${Number((kb_in / 1000).toFixed(2))} MB`
    else if (magnitude < 9) return `${Number((kb_in / 1000000).toFixed(2))} GB`
    else if (magnitude < 9) return `${Number((kb_in / 1000000000).toFixed(2))} TB`
    else if (magnitude < 9) return `${Number((kb_in / 1000000000000).toFixed(2))} PB`
    else return `${kb_in} KB`
}

export function getMagnitude(num){
    return Math.floor(Math.log(num) / Math.LN10);
}