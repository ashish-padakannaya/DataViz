/*** Define parameters and tools ***/
var width = 650,
    height = 650,
    outerRadius = Math.min(width, height) / 2 - 120,//100,
    innerRadius = outerRadius - 10;

//create the arc path data generator for the groups
var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

//create the chord path data generator for the chords
var path = d3.svg.chord()
    .radius(innerRadius - 4);// subtracted 4 to separate the ribbon

function getDefaultLayout() {
    return d3.layout.chord()
        .padding(0.03)
        .sortSubgroups(d3.descending)
        .sortChords(d3.ascending);
}
var last_layout, g;
var matrix, playerColors = [], playerScores = [], winner = null;

const setChord = (year, stage) => {

    d3.select("#chart_placeholder").selectAll("*").remove();

    /*** Initialize the visualization ***/
    g = d3.select("#chart_placeholder").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id", "circle")
        .attr("transform",
            "translate(" + width / 2 + "," + height / 2 + ")");

    g.append("circle")
        .attr("r", outerRadius);

    getTheMoney(year, stage).then((res) => {
        playerScores = res[0];
        playerColors = res[1];
        matrix = res[2];
        winner = res[3];
        updateChords();
    });
}

/* Create OR update a chord layout from a data matrix */
function updateChords() {

    g.selectAll("path.chord").remove();
    last_layout = undefined;

    /* Compute chord layout. */
    layout = getDefaultLayout(); //create a new layout object
    layout.matrix(matrix);
    /* Create/update "group" elements */
    var groupG = g.selectAll("g.group")
        .data(layout.groups(), function (d) {
            return d.index;
        });


    groupG.exit()
        .transition()
        .duration(1500)
        .attr("opacity", 0)
        .remove(); //remove after transitions are complete

    var newGroups = groupG.enter().append("g")
        .attr("class", "group");

    //Create the title tooltip for the new groups
    newGroups.append("title");

    //create the arc paths and set the constant attributes
    //(those based on the group index, not on the value)
    newGroups.append("path")
        .attr("id", function (d) {
            return "group" + d.index;
        })
        .style("fill", function (d) {
            return playerColors[d.index].color;
        });

    //update the paths to match the layout
    groupG.select("path")
        .transition()
        .duration(1500)
        .attrTween("d", arcTween(last_layout))
        ;

    //create the group labels
    newGroups.append("svg:text")
        .attr("xlink:href", function (d) {
            return "#group" + d.index;
        })
        .attr("dy", ".35em")
        .attr("color", "#fff")
        .style("font-weight", function (d) {
            if (playerColors[d.index].name === winner) return "bold";
            return "normal";
        })
        .text(function (d) {
            return `${playerColors[d.index].name} ${playerColors[d.index].name == winner ? '♛' : '' }`;
        })

    //position group labels to match layout
    groupG.select("text")
        .transition()
        .duration(1500)
        .attr("transform", function (d) {
            d.angle = (d.startAngle + d.endAngle) / 2;
            //store the midpoint angle in the data object

            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                " translate(" + (innerRadius + 26) + ")" +
                (d.angle > Math.PI ? " rotate(180)" : " rotate(0)");
            //include the rotate zero so that transforms can be interpolated
        })
        .attr("text-anchor", function (d) {
            return d.angle > Math.PI ? "end" : "begin";
        });

    /* Create/update the chord paths */
    var chordPaths = g.selectAll("path.chord")
        .data(layout.chords(), chordKey);
    //specify a key function to match chords
    //between updates


    //create the new chord paths
    var newChords = chordPaths.enter()
        .append("path")
        .attr("class", "chord");

    // Add title tooltip for each new chord.
    newChords.append("test");

    var tipSVG = d3.select("#matchViz");
    // Update all chord title texts
    g.selectAll("path.chord")
        .on("mouseover", (d, i) => {
            temp = d3.select("#chart_placeholder").select("svg").select("g").selectAll("path")[0]
                .filter((item) => {
                    var k = d3.select(item);
                    return k[0][0].id == "";
                });
            activePath = d3.select(temp[i]);
            if (activePath.attr("class") == "chord") {
                var match = activePath.select("test").html();
                let [p1, p2] = match.split(',');
                var scores = playerScores[p1][p2]['score'];
                var game = playerScores[p1][p2]['game'];
                let metrics = [playerScores[p1][p2]['player1_metrics'], playerScores[p1][p2]['player2_metrics']]
                p1_color = playerColors.filter(item => item.name == p1)[0].color;
                p2_color = playerColors.filter(item => item.name == p2)[0].color;
                let [p1_i_color, p2_i_color] = [lightOrDark(p1_color), lightOrDark(p2_color)];
                generateMatchChart(p1_color, p1_i_color, p2_color, p2_i_color, game, scores, p1, p2, metrics);
            }

        })
        .on("mouseout", (d, i) => {
            tipSVG.selectAll("*").remove();
        })

    chordPaths.select("test")
        .text(function (d) {
            player1 = playerColors[d.source.index].name;
            player2 = playerColors[d.target.index].name;
            return [player1, ",", player2].join("");
        });

    //handle exiting paths:
    chordPaths.exit().transition()
        .duration(1500)
        .attr("opacity", 0)
        .remove();

    //update the path shape
    chordPaths.transition()
        .duration(1500)
        .style("fill", function (d) {
            return playerColors[d.source.index].color;
        })
        .attrTween("d", chordTween(last_layout));

    groupG
        .on("mouseover", function (d, i) {
            var player = playerColors[i];
            year = parseInt(document.getElementById("yearSelect").value);
            getPlayerTimeLine(player.name, year).then((data) => {
                let [res, title] = [data.res, data.title];
                var colors = [];
                res.forEach((obj) => {
                    if (obj.won) { colors.push(player.color) }
                    else { colors.push(playerColors.filter((item) => item.name == obj['player2'])[0].color) }
                });
                generateTimeLine(res, title, colors);
            });
            chordPaths.classed("fade", function (p) {
                return ((p.source.index != d.index) && (p.target.index != d.index));
            });
        })
        .on("mouseout", () => {
            tipSVG.selectAll("*").remove();
        })

    //save for next update
    last_layout = layout;
}

selectUpdate = () => {
    year = parseInt(document.getElementById("yearSelect").value);
    stage = parseInt(document.getElementById("stageSelect").value);
    setChord(year, stage);
}

selectUpdate();