import _ from "lodash";
import { getWidgetText, props2Text } from "../../helper/util";

export default (config) => {
  const rowProps = _.pick(config, ["gutter"]);
  const childTexts = config.childes.map((child) => getWidgetText(child));
  return `<el-row ${props2Text(rowProps)}>
  ${childTexts.join("\n")}
  </el-row>`;
};
