export async function calculateCharts(planets, label) {
  try {
    let data = {};
    let labels = [];
    let datasets = [
      {
        label: `${label}`,
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 206, 86, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ];

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function(value, index, values) {
                //we could manipulate this data if required. For e.g. $value or anything else
                //Doing this only for demonstration purposes
                return value;
              }
            }
          }
        ]
      }
    };

    planets.forEach(p => {
      labels.push(p.name);
      datasets[0].data.push(
        !isNaN(parseInt(p.diameter)) ? parseInt(p.diameter) : 0
      );
    });

    data = {
      labels: labels,
      datasets: datasets
    };

    return { data, options };
  } catch (error) {
    return error; //Our "Home" component will handle reporting error through our common error handler
  }
}
