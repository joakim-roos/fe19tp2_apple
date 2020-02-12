import React from "react";
import Chart from "./Chart";
import * as data from "./data";
import Table from "./Table";

var dataArr = [];
for (let item in data) {
  dataArr.push(data[item]);
}

const Charts = props => {
  return (
    <div className="Charts">
      <Table />

      {/* {dataArr.map(item => (
        <Chart key={item.title} apiData={item} />
      ))} */}
    </div>
  );
};

export default Charts;
