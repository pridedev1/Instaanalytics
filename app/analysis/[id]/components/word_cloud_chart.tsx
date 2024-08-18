'use client'

import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5wc from "@amcharts/amcharts5/wc";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { sampleResponse } from "@/app/utils/constants";

const WordCloudChart = () => {
  const color1 = am5.color(0xf5004f);
  const color2 = am5.color(0xEF5A6F);
  useLayoutEffect(() => {
    let root = am5.Root.new("wordclouddiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let series = root.container.children.push(
      am5wc.WordCloud.new(root, {
        categoryField: "tag",
        valueField: "weight",
        maxFontSize: am5.percent(50),
        minFontSize: am5.percent(20),
        angles:[0]
      })
    );
const data = sampleResponse.profileData.hashtags.map((d) => ({
  tag:d.name,weight:d.count
}))
series.data.setAll(data)
    // series.data.setAll([
    //     { tag: "#chocolate", weight: 10 },
    //     { tag: "#ShapeYourWorld", weight: 15 },
    //     { tag: "#minecraft15", weight: 12 },
    //     { tag: "#Minecraft", weight: 14 },
    //     { tag: "#Chocolate", weight: 13 },
    //     { tag: "#grateful", weight: 9 },
    //     { tag: "#banana", weight: 11 },
    //     { tag: "#AmauryGuichon", weight: 16 },
    //     { tag: "#amauryguichon", weight: 8 },
    //     { tag: "#nails", weight: 7 },
    //     { tag: "#carrot", weight: 6 },
    //     { tag: "#croissant", weight: 5 },
    //     { tag: "#breakfast", weight: 4 },
    //     { tag: "#peach", weight: 3 },
    //     { tag: "#furniture", weight: 2 },
    //   ]);
  
      series.set("heatRules", [
        {
          target: series.labels.template,
          dataField: "value",
          min: color1,
          max: color2,
          key: "fill",
        },
      ]);
  
    // chart.series.push(
    //   am5wc.WordCloud.new(root, {
    //     categoryField: "tag",
    //     valueField: "weight",
    //   })
    // );

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="wordclouddiv" style={{ width: "100%", height: "100%" }} ></div>;
};

export default WordCloudChart;