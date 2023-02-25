import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Row, Container } from "react-bootstrap";

const SensorChart = () => {
  const ws = useRef();
  const [data, setData] = useState([]);
  const [plotData, setPlotData] = useState([]);

  useEffect(() => {
    let isMounted = true
    //Send request to our websocket server using the "/request" path
    ws.current = new WebSocket("ws://localhost:8080/request");

    // Sends a trigger payload to the Node backend to prompt the server to return data from the ESP32
    // Return data is an array of 4 JS objects
    const dat = {type: "import",}
    ws.current.onopen = (event) => {
      ws.current.send(JSON.stringify(dat))
    }

    ws.current.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      console.log(`Received message :: ${message}`);
      // Upon receiving websocket message then add it to the list of data that we are displaying
      let newDataArray = [
        ...data,
        {
          name: message[0].name,
          tracking: message[0].tracking,
          count: message[0].count,
          freq: message[0].freq,
          dispenseQty: message[0].dispenseQty,
          meal: message[0].meal,
          history: message[0].history,
        },
        {
          name: message[1].name,
          tracking: message[1].tracking,
          count: message[1].count,
          freq: message[1].freq,
          dispenseQty: message[1].dispenseQty,
          meal: message[1].meal,
          history: message[1].history,
        },
        {
          name: message[2].name,
          tracking: message[2].tracking,
          count: message[2].count,
          freq: message[2].freq,
          dispenseQty: message[2].dispenseQty,
          meal: message[2].meal,
          history: message[2].history,
        },
        {
          name: message[3].name,
          tracking: message[3].tracking,
          count: message[3].count,
          freq: message[3].freq,
          dispenseQty: message[3].dispenseQty,
          meal: message[3].meal,
          history: message[3].history,
        },
      ];
      console.log(newDataArray);
      setData(newDataArray);

      let plot = []
      for (let [key, value] of Object.entries(message[1].history)) {
        plot.push({
          date: [key],
          AmountDispensed: [value],
          ExpectedAmount: message[1].freq * message[1].dispenseQty
        })
      }
      console.log('PlotData populated')
      console.log(plotData)
      if (isMounted) {
        setPlotData(plot)
      }
    };
    ws.current.onclose = (ev) => {
      console.log("Client socket close!");
      setData([])
    };

    return () => {
      isMounted = false
      console.log("Cleaning up! ");
      ws.current.close();
    };
  }, []);

  //Display the chart using rechart.js
  return (
    <Container className="p-3">
        <h1 className="graph-header">Real time IOT Sensor Data</h1>
      <Row className="justify-content-md-center">
        <div style={{ width: 500, height: 200 }}>
          <ResponsiveContainer>
            <LineChart
              width={400}
              height={200}
              data={plotData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis/>
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="AmountDispensed"
                stroke="#8884d8"
                activeDot={{ r: 24 }}
                strokeWidth="2"
              />
              <Line
                type="monotone"
                dataKey="ExpectedAmount"
                stroke="red"
                activeDot={{ r: 24 }}
                strokeWidth="2"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Row>
    </Container>
  );
};

export default SensorChart;
