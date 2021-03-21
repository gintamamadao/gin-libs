import fsUtil from "ginlibs-file-util";

export const renderTplFile = (path: string, data: any) => {
  if (!fsUtil.exist(path)) {
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
