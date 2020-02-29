function arcTween(oldLayout) {
    var oldGroups = {};
    if (oldLayout) {
        oldLayout.groups().forEach(function (groupData) {
            oldGroups[groupData.index] = groupData;
        });
    }

    return function (d, i) {
        var tween;
        var old = oldGroups[d.index];
        if (old) { //there's a matching old group
            tween = d3.interpolate(old, d);
        }
        else {
            //create a zero-width arc object
            var emptyArc = {
                startAngle: d.startAngle,
                endAngle: d.startAngle
            };
            tween = d3.interpolate(emptyArc, d);
        }

        return function (t) {
            return arc(tween(t));
        };
    };
}

function chordKey(data) {
    return (data.source.index < data.target.index) ?
        data.source.index + "-" + data.target.index :
        data.target.index + "-" + data.source.index;
}

function chordTween(oldLayout) {

    var oldChords = {};

    if (oldLayout) {
        oldLayout.chords().forEach(function (chordData) {
            oldChords[chordKey(chordData)] = chordData;
        });
    }

    return function (d, i) {
        //this function will be called for each active chord

        var tween;
        var old = oldChords[chordKey(d)];
        if (old) {
            //old is not undefined, i.e.
            //there is a matching old chord value

            //check whether source and target have been switched:
            if (d.source.index != old.source.index) {
                //swap source and target to match the new data
                old = {
                    source: old.target,
                    target: old.source
                };
            }

            tween = d3.interpolate(old, d);
        }
        else {
            //create a zero-width chord object
            ///////////////////////////////////////////////////////////in the copy ////////////////            
            if (oldLayout) {
                var oldGroups = oldLayout.groups().filter(function (group) {
                    return ((group.index == d.source.index) ||
                        (group.index == d.target.index))
                });
                old = {
                    source: oldGroups[0],
                    target: oldGroups[1] || oldGroups[0]
                };
                //the OR in target is in case source and target are equal
                //in the data, in which case only one group will pass the
                //filter function

                if (d.source.index != old.source.index) {
                    //swap source and target to match the new data
                    old = {
                        source: old.target,
                        target: old.source
                    };
                }
            }
            else old = d;
            /////////////////////////////////////////////////////////////////               
            var emptyChord = {
                source: {
                    startAngle: old.source.startAngle,
                    endAngle: old.source.startAngle
                },
                target: {
                    startAngle: old.target.startAngle,
                    endAngle: old.target.startAngle
                }
            };
            tween = d3.interpolate(emptyChord, d);
        }

        return function (t) {
            //this function calculates the intermediary shapes
            return path(tween(t));
        };
    };
}