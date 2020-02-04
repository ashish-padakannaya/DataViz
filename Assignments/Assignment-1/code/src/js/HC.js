function generateChart() {
    Highcharts.chart('container', {
        colors: ['#21753d', '#2e9551', '#40b33f','#78d12f','Grey'],
        chart: {
            type: 'column',
            inverted: true,
            polar: true
        },
        title: {
            text: 'Comparison of Djokovic\'s rally points and length with every opponent in the AUS open finals (2011-2019)'
        },
        tooltip: {
            outside: true
        },
        pane: {
            size: '85%',
            endAngle: 270
        },
        xAxis: {
            tickInterval: 1,
            labels: {
                align: 'right',
                useHTML: true,
                allowOverlap: true,
                step: 1,
                y: 4,
                style: {
                    fontSize: '12px'
                }
            },
            lineWidth: 0,
            categories: [
                'Murray 2011',
                'Nadal 2012',
                'Murray 2013',
                'Murray 2015',
                'Murray 2016',
                'Nadal 2019'
            ]
        },
        yAxis: {
            lineWidth: 0,
            tickInterval: 25,
            reversedStacks: false,
            endOnTick: true,
            showLastLabel: true
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointPadding: 0,
                groupPadding: 0.15,
                borderWidth: 1,
                borderColor: 'black',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        console.log(this);
                                  if(this.color === "Grey"){
                          return(this.y);
                      }
                                }
                }
            }
        },
        series: [{
            name: '1-3 shots',
            data: [38, 91, 69, 64, 58, 42]
        }, {
            name: '4-6 shots',
            data: [23, 37, 26, 26, 26, 17,]
        }, {
            name: '7-9 shots',
            data: [21, 29, 15, 17, 11, 12,]
        }, {
            name: '10+ shots',
            data: [24, 33, 29, 29, 28, 18,]
        }, {
            name: 'Lost rally',
            data: [78, 175, 126, 117, 50, 34]
        }]
    });
}
