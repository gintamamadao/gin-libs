import fsUtil from "./fsUtil";
import lu from "./logUtil";

export const renderTplFile = (path: string, data: any) => {
  if (!fsUtil.exist(path)) {
    lu.red("未找到模板文件").show();
    return;
  }
  const cont = fsUtil.read(path);
  let newCont = cont;
  for (const key of Object.keys(data)) {
    newCont = newCont.replace(
      new RegExp(`\\{\\{\\{${key}\\}\\}\\}`, "g"),
      data[key] || ""
    );
  }
  return newCont;
};
