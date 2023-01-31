import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const DepthChartWidget = () => {
  const asksData = [
    [0.1524, 0.948665],
    [0.1539, 35.510715],
    [0.154, 39.883437],
    [0.1541, 40.499661],
    [0.1545, 43.262994000000006],
    [0.1547, 60.14799400000001],
    [0.1553, 60.30799400000001],
    [0.1558, 60.55018100000001],
    [0.1564, 68.381696],
    [0.1567, 69.46518400000001],
    [0.1569, 69.621464],
    [0.157, 70.398015],
    [0.1574, 70.400197],
    [0.1575, 73.199217],
    [0.158, 77.700017],
    [0.1583, 79.449017],
    [0.1588, 79.584064],
    [0.159, 80.584064],
    [0.16, 81.58156],
    [0.1608, 83.38156],
  ];

  const bidsData = [
    [0.1435, 242.521842],
    [0.1436, 206.49862099999999],
    [0.1437, 205.823735],
    [0.1438, 197.33275],
    [0.1439, 153.677454],
    [0.144, 146.007722],
    [0.1442, 82.55212900000001],
    [0.1443, 59.152814000000006],
    [0.1444, 57.942260000000005],
    [0.1445, 57.483850000000004],
    [0.1446, 52.39210800000001],
    [0.1447, 51.867208000000005],
    [0.1448, 44.104697],
    [0.1449, 40.131217],
    [0.145, 31.878217],
    [0.1451, 22.794916999999998],
    [0.1453, 12.345828999999998],
    [0.1454, 10.035642],
    [0.148, 9.326642],
    [0.1522, 3.76317],
  ];

  const options = {
    chart: {
      type: 'area',
      zoomType: 'xy',
      backgroundColor: '#000000',
      borderColor: '#000000',
    },
    title: {
      text: ' ',
    },
    xAxis: {
      minPadding: 0,
      maxPadding: 0,
      plotLines: [
        {
          color: 'rgba(255, 255, 255, 0.25)',
          opacity: 0.75,
          value: 0.1523,
          width: 1.5,
          label: {
            text: ' ',
            rotation: 90,
          },
        },
      ],
      title: {},
      tickWidth: 0,
      lineWidth: 0,
      labels: {
        style: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
    yAxis: [
      {
        lineWidth: 0,
        gridLineWidth: 0,
        title: null,
        tickWidth: 0,
        tickLength: 5,
        tickPosition: 'inside',
        labels: {
          x: 50,
          enabled: false,
        },
      },
      {
        opposite: true,
        linkedTo: 0,
        lineWidth: 0,
        gridLineWidth: 0,
        title: null,
        tickWidth: 0,
        tickLength: 5,
        tickPosition: 'inside',
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        },
      },
    ],
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillOpacity: 0.2,
        lineWidth: 1,
        step: 'center',
      },
    },
    tooltip: {
      headerFormat:
        '<span style="font-size=10px;">Price: {point.key}</span><br/>',
      valueDecimals: 2,
    },
    series: [
      {
        name: 'Asks',
        data: asksData,
        color: 'rgba(216, 99, 113, 0.8)',
      },
      {
        name: 'Bids',
        data: bidsData,
        color: 'rgba(0, 181, 120, 0.8);',
      },
    ],
  };

  return (
    <div className=" rounded-10 bg-silver p-20">
      <div className="mb-20 font-weight-500">Depth</div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
