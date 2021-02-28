import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";

import Form from "react-bootstrap/Form";

const VerticalBar = ({ chartsData, setChartType, chartType }) => (
  <>
    <div className="header">
      <h1 className="title">Planets</h1>
      <div className="chart-type-div">
        <label>Chart Type</label>
        <Form.Check
          onChange={() => setChartType("bar")}
          inline
          label="Bar"
          type="radio"
          id={`inline-radio-1`}
          checked={chartType === "bar"}
          value={chartType}
        />
        <Form.Check
          onChange={() => setChartType("pie")}
          inline
          label="Pie"
          type="radio"
          id={`inline-radio-2`}
          checked={chartType === "pie"}
          value={chartType}
        />
        <Form.Check
          onChange={() => setChartType("line")}
          inline
          label="Line"
          type="radio"
          id={`inline-radio-3`}
          checked={chartType === "line"}
          value={chartType}
        />
      </div>
    </div>
    <div className="chart-container">
      {chartType === "bar" && (
        <Bar data={chartsData.data} options={chartsData.options} />
      )}
      {chartType === "pie" && <Pie data={chartsData.data} />}
      {chartType === "line" && (
        <Line data={chartsData.data} options={chartsData.options} />
      )}
    </div>
  </>
);

export default VerticalBar;
