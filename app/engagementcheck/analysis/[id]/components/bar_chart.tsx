"use client";
import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { formatNumber } from "@/utils/helper";
import { sampleResponse } from "@/utils/constants";

const BarChartWithImages = () => {
  const mediaData = sampleResponse.profileData.media;
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let data2 = mediaData.map((d) => {
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

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingBottom: 50,
        paddingTop: 40,
        paddingLeft: 0,
        paddingRight: 0,
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.grid.template.set("visible", false);

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        paddingTop: 40,
        categoryField: "name",
        renderer: xRenderer,
      })
    );
    xAxis.get("renderer").labels.template.setAll({
      text: "",
      visible: false, // Hide x-axis labels
    });

    let yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.set("strokeDasharray", [3]);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: yRenderer,
      })
    );
    yAxis
      .get("renderer")
      .labels.template.adapters.add("text", function (text, target) {
        return formatNumber(text ?? "0");
      });

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Likes",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "likes",
        categoryXField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueY}",
        }),
      })
    );
    let series2 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Comments",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "comments",
        categoryXField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueY}",
        }),
      })
    );

    series2.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusTL: 10,
      maxWidth: 50,
      fillOpacity: 0.8,
    });

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusTL: 10,
      maxWidth: 50,
      fillOpacity: 0.8,
    });

    let currentlyHovered: any;

    // let tooltip = am5.Tooltip.new(root, {
    //   getFillFromSprite: false,
    //   getStrokeFromSprite: true,
    //   autoTextColor: false,
    //   pointerOrientation: "horizontal",
    //   labelText: "{name}\nLikes: {likes}\nComments: {comments}",
    // });

    // chart.set("tooltip", tooltip);

    // series.columns.template.events.on("pointerover", function (e) {
    //   handleHover(e.target.dataItem);
    // });

    // series.columns.template.events.on("pointerout", function (e) {
    //   handleOut();
    // });

    // series2.columns.template.events.on("pointerover", function (e) {
    //   handleHover(e.target.dataItem);
    // });

    // series2.columns.template.events.on("pointerout", function (e) {
    //   handleOut();
    // });

    // function handleHover(dataItem: any) {
    //   if (dataItem && currentlyHovered !== dataItem) {
    //     handleOut();
    //     currentlyHovered = dataItem;
    //     let bullet = dataItem.bullets[0];
    //     bullet.animate({
    //       key: "locationY",
    //       to: 1,
    //       duration: 600,
    //       easing: am5.ease.out(am5.ease.cubic),
    //     });

    //     let dataContext = dataItem.dataContext;
    //     tooltip.label.set(
    //       "text",
    //       `${dataContext.name}\nLikes: ${dataContext.likes}\nComments: ${dataContext.comments}`
    //     );
    //     tooltip.show();
    //   }
    // }

    // function handleOut() {
    //   if (currentlyHovered) {
    //     let bullet = currentlyHovered.bullets[0];
    //     bullet.animate({
    //       key: "locationY",
    //       to: 0,
    //       duration: 600,
    //       easing: am5.ease.out(am5.ease.cubic),
    //     });
    //     tooltip.hide();
    //   }
    // }

    let circleTemplate = am5.Template.new({});

    series.bullets.push(function (root, series, dataItem) {
      let bulletContainer = am5.Container.new(root, {});
      let circle = bulletContainer.children.push(
        am5.Circle.new(
          root,
          {
            radius: 34,
          },
          circleTemplate as any
        )
      );

      let maskCircle = bulletContainer.children.push(
        am5.Circle.new(root, { radius: 32 })
      );

      let imageContainer = bulletContainer.children.push(
        am5.Container.new(root, {
          mask: maskCircle,
        })
      );

      let image = imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 150,
          height: 150,
        })
      );

      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: bulletContainer,
        locationX: 1.2,
      });
    });

    series.set("heatRules", [
      {
        dataField: "valueY",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: series.columns.template,
        key: "fill",
      },
      {
        dataField: "valueY",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: circleTemplate,
        key: "fill",
      },
    ]);
    series2.set("heatRules", [
      {
        dataField: "valueY",
        min: am5.color(0x36e5dc),
        max: am5.color(0x465faa),
        target: series2.columns.template,
        key: "fill",
      },
    ]);

    series2.data.setAll(data2);
    series.data.setAll(data2);
    xAxis.data.setAll(data2);

    // Add legend
    // let legend = chart.bottomAxesContainer.children.push(
    //   am5.Legend.new(root, {
    //     centerX: am5.p50,
    //     x: am5.p50,
    //     y: am5.p100,
    //     dy: -20,
    //   })
    // );

    // legend.data.setAll(chart.series.values);

    let legend = chart.rightAxesContainer.children.push(
      am5.Legend.new(root, {
        width: 200,
        paddingLeft: 15,
        height: am5.percent(100),
      })
    );

    // legend.itemContainers.template.events.on("pointerover", function (e) {
    //   let itemContainer = e.target;
    //   let series = itemContainer.dataItem!.dataContext;

    //   chart.series.each(function (chartSeries) {
    //     if (chartSeries !== series) {
    //       chartSeries.strokes.template.setAll({
    //         strokeOpacity: 0.15,
    //         stroke: am5.color(0x000000),
    //       });
    //     } else {
    //       chartSeries.strokes.template.setAll({
    //         strokeWidth: 3,
    //       });
    //     }
    //   });
    // });

    // legend.itemContainers.template.events.on("pointerout", function (e) {
    //   chart.series.each(function (chartSeries) {
    //     chartSeries.strokes.template.setAll({
    //       strokeOpacity: 1,
    //       strokeWidth: 1,
    //       stroke: chartSeries.get("fill"),
    //     });
    //   });
    // });

    legend.itemContainers.template.set("width", am5.p100);
    legend.valueLabels.template.setAll({
      width: am5.p100,
      textAlign: "right",
    });

    legend.data.setAll(chart.series.values);

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    // cursor.events.on("cursormoved", function () {
    //   let dataItem = series.get("tooltip")!.dataItem;
    //   if (dataItem) {
    //     handleHover(dataItem);
    //   } else {
    //     handleOut();
    //   }
    // });

    series.appear();
    series2.appear();
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default BarChartWithImages;
