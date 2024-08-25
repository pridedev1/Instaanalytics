"use client";

import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { sampleResponse } from "@/app/utils/constants";
import { formatNumber } from "@/app/utils/helper";
import { isMobile } from "react-device-detect";
import Image from "next/image";

const BarChart = ({ mediaData }: { mediaData: any }) => {
  // const mediaData = sampleResponse.profileData.media;
  const blueColor = am5.color(0x2e8df2);
  const pinkColor = am5.color(0xf22f9d);
  useLayoutEffect(() => {
    // Create root element
    let root = am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingBottom: isMobile ? 120 : 60,
        paddingTop: 40,
        paddingLeft: 0,
        paddingRight: 0,
        // panX: false,
        // panY: false,
        // paddingLeft: 0,
        // wheelX: "panX",
        // wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    // Add legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p100,
        centerY: am5.p100,
        x: am5.p100,
        y: am5.p100,
        paddingTop: 20,
      })
    );

    let data2 = mediaData.map((d: any) => {
      return {
        name: d.caption,
        caption: d.caption,
        likes: d.total_likes,
        comments: d.total_comments,
        pictureSettings: {
          src: `${
            process.env.NEXT_PUBLIC_API_URL
          }/proxy-image/${encodeURIComponent(
            d.url.replace("https://cdn-image.notjustanalytics.com/", "")
          )}`,
        },
      };
    });
    console.log("data2 :", data2);
    // Create axes

    let xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true,
      minGridDistance: 10,
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.setAll({
      location: 1,
    });

    xAxis.data.setAll(data2);

    // Custom label template to replace text with image
    xRenderer.labels.template.setAll({
      text: "",
      oversizedBehavior: "none",
      //   maxWidth: 50,
      //   maxHeight: 50,
      //   rotation: 0,
      //   centerY: am5.p100,
      //   centerX: am5.p50,
      //   paddingTop: 10,
    });
    xRenderer.labels.template.adapters.add("html", (html, target) => {
      let dataItem = target.dataItem;
      if (dataItem) {
        let dataContext = dataItem.dataContext as any;

        if (dataContext && dataContext.pictureSettings.src) {
          console.log("image :", dataContext.pictureSettings.src);
          return `<img src="${dataContext.pictureSettings.src}" style="width: ${
            isMobile ? "25px" : "80px"
          }; height: ${
            isMobile ? "25px" : "80px"
          }; border: 4px solid #E9EAF0;border-radius: 10px;object-fit: cover;" />`;
        }
      }
      return html;
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    );
    yAxis
      .get("renderer")
      .labels.template.adapters.add("text", function (text, target) {
        return formatNumber(text ?? "0");
      });
    // Add series
    function makeSeries(name: any, fieldName: any, color: any) {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "name",
        })
      );

      series.columns.template.setAll({
        tooltipText: "{valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
        cornerRadiusTL: 10, // Top-left corner radius
        cornerRadiusTR: 10, // Top-right corner radius
        fill: color,
      });

      series.data.setAll(data2);

      // Make stuff animate on load
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
    }

    makeSeries("Likes", "likes", blueColor);
    makeSeries("Comments", "comments", pinkColor);
    // makeSeries("Asia", "asia");
    // makeSeries("Latin America", "lamerica");
    // makeSeries("Middle East", "meast");
    // makeSeries("Africa", "africa");

    // Make stuff animate on load
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute bottom-4 mx-2 sm:left-4 gradient-border-wrapper z-10 rounded-3xl">
        <div className="gradient-border">
          <div className=" flex flex-row gap-2 items-center">
            <Image src="/gradient_idea.svg" width={30} height={40} alt="idea" />
            <span>
              Study the key elements of top posts to inspire your own content!
            </span>
          </div>
        </div>
      </div>

      <div
        id="chartdiv"
        className="bg-white rounded-lg mt-4 "
        style={{ width: "100%", height: "500px" }}
      ></div>
    </div>
  );
};

export default BarChart;
