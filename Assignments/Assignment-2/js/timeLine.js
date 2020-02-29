const generateTimeLine = (data, title, colors) => {
    Highcharts.chart('matchViz', {
        chart: {
            type: 'timeline',
            inverted: true,
        },
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{typeDescription}</div>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            },
            point: {
                valueDescriptionFormat: '{index}. {point.label}. {point.description}.'
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        title: {
            text: title
        },
        credits:{
            enabled: false
        },
        colors : colors.reverse(), 
        series: [{ data: data.reverse() }]
    });
}