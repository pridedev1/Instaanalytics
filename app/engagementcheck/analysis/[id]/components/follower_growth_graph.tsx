"use client";
import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { formatNumber } from "@/utils/helper";

const FollowerGrowthGraph = ({ followerHistory, isFollowing }: any) => {
  const color = am5.color(0x408ef2);
  useLayoutEffect(() => {
    let root = am5.Root.new("follower-growth-bar-chart");

    const myTheme = am5.Theme.new(root);

    myTheme.rule("AxisLabel", ["minor"]).setAll({
      dy: 1,
    });

    root.setThemes([
      am5themes_Animated.new(root),
      myTheme,
      am5themes_Responsive.new(root),
    ]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
      })
    );

    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
      })
    );
    cursor.lineY.set("visible", false);

    let date = new Date();
    date.setHours(0, 0, 0, 0);
    let value = 100;

    function generateData() {
      value = Math.round(Math.random() * 10 - 5 + value);
      am5.time.add(date, "day", 1);
      return {
        date: date.getTime(),
        value: value,
      };
    }

    function generateDatas(count: number) {
      let data = [];
      for (let i = 0; i < count; ++i) {
        data.push(generateData());
      }
      return data;
    }

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
          timeUnit: "day",
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true,
          minorLabelsEnabled: true,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.set("minorDateFormats", {
      day: "dd",
      month: "MM",
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
    yAxis
      .get("renderer")
      .labels.template.adapters.add("text", function (text, target) {
        return formatNumber(text ?? "0");
      });
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
          keepTargetHover: true,
        }),
      })
    );

    series.columns.template.setAll({ strokeOpacity: 0 });

    // chart.set(
    //   "scrollbarX",
    //   am5.Scrollbar.new(root, {
    //     orientation: "horizontal",
    //   })
    // );
    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusTL: 20, // Top-left corner radius
      cornerRadiusTR: 20, // Top-right corner radius
      cornerRadiusBL: 20,
      cornerRadiusBR: 20,
      fill: color,
    });
    let data = generateDatas(30);
    let data2 = followerHistory.slice(0, 30).map((d: any) => {
      let [year, month, day] = d.date.split("-");

      let date = new Date(
        parseInt(year),
        parseInt(month),
        parseInt(day)
      ).getTime();
      return {
        value: d.newFollower,
        date: date,
        d: d.date,
      };
    });
    console.log("data2 :", data);
    data[4].value = -100;
    series.data.setAll(data2);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div className="w-full bg-white p-2 rounded-md">
      <div
        id="follower-growth-bar-chart"
        style={{ width: "100%", height: "500px" }}
      ></div>
    </div>
  );
};

export default FollowerGrowthGraph;
