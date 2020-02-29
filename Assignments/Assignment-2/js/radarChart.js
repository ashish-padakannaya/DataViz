const generateMatchChart = (p1_color, p1_i_color, p2_color, p2_i_color, game, scores, p1, p2, metrics) => {
    Highcharts.chart('matchViz', {
        chart: {
            polar: true,
            type: 'area'
        },
        yAxis: {
            min: 0,
            max: 110,
        },
        title: {
            useHTML: true,
            text: `<span style="background-color:${p1_color};color:${p1_i_color}">${p1}</span>
                 vs 
                <span style="background-color:${p2_color};color:${p2_i_color}">${p2}</span> <br/>
                <b>stage:</b> ${game} <br/>
                <b>Winner:</b> ${p1} <br/>
                <b>score: </b>${scores}`,
            style: {
                "text-align": "center"
            }
        },
        credits: {
            enabled: false
        },

        pane: {
            size: '75%'
        },

        xAxis: {
            categories: ['firstServe','firstPointWon','secPointWon','break','return'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
        },
        series: [{
            data: metrics[0],
            color: p1_color,
            pointPlacement: 'on'
        }, {
            data: metrics[1],
            color: p2_color,
            pointPlacement: 'on'
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        enabled: false,
                    },
                }
            }]
        }

    });
}
