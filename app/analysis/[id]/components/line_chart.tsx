"use client";

import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import getOneMonthAgoDate from "@/utils/getOnMonthAgoDate";
import { formatNumber } from "@/utils/helper";
import Image from "next/image";
import { isMobile } from "react-device-detect";

const LineChart = ({ followingData }: { followingData: any }) => {
  const color = am5.color(0xf5004f);
  useLayoutEffect(() => {
    // Create root element
    let root = am5.Root.new("line-chart");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingBottom: isMobile ? 140 : 100,
        //   wheelX: false, // Disable zoom
        //   wheelY: false, // Disable zoom
        pinchZoomX: false, // Disable zoom
      })
    );

    // Add cursor
    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);
    // cursor..set("fill", color);

    // Generate random data
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let value = 100;

    // Create axes
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          //   pan: "zoom",
        }),
      })
    );
    // Apply custom formatting to the Y-axis labels
    // yAxis.get("renderer").labels.template.set("text", "{value}");

    yAxis
      .get("renderer")
      .labels.template.adapters.add("text", function (text, target) {
        return formatNumber(text ?? "0");
      });

    // Add series
    let series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        stroke: color,
        fill: color,
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
          // labelHTML:"<div>{valueY}</div>",
          keepTargetHover: true,
        }),
      })
    );

    series.strokes.template.setAll({
      strokeWidth: 3,
      // strokeDasharray: [10,5]
    });
    // Set data
    let monthAgoDate = getOneMonthAgoDate();
    let filterData = followingData.history.filter(
      (d: any) => new Date(d.date) > new Date(monthAgoDate)
    );
    let data = filterData.map((d: any) => ({
      date: new Date(d.date).getTime(),
      value: d.follower,
    }));

    series.data.setAll(data.reverse());

    // series.set("tooltip", am5.Tooltip.new(root, {
    //   labelText: "{valueY}",
    //   keepTargetHover: true,
    // }));
    // series.data.setAll([
    //     { date: new Date(2023, 0, 1).getTime(), value: 50 },
    //     { date: new Date(2023, 0, 2).getTime(), value: 2 },
    //     { date: new Date(2023, 0, 3).getTime(), value: 60 },
    //     { date: new Date(2023, 0, 4).getTime(), value: 65 },
    //     { date: new Date(2023, 0, 5).getTime(), value: 70 },
    //   ]);
    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div className="relative border rounded-md">
      <div className="absolute bottom-4 mx-2 sm:left-4 gradient-border-wrapper z-10 rounded-3xl">
        <div className="gradient-border">
          <div className=" flex flex-row gap-2 items-center">
            <Image src="/gradient_idea.svg" width={30} height={40} alt="idea" />
            <span>
              Continuous growth in followers is essential for a robust and
              flourishing Instagram presence.
            </span>
          </div>
        </div>
      </div>
      <div
        id="line-chart"
        className="bg-white py-2 pb-10 rounded-lg"
        style={{ width: "100%", height: "500px" }}
      ></div>
    </div>
  );
};

export default LineChart;
