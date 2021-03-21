import fromMarkdown from "mdast-util-from-markdown";
import fsUtil from "ginlibs-file-util";
import {
  getEntryLink,
  getEntryName,
  getNotesPntChldInfo,
  checkChildren,
} from "../utils/astUtil";
import { LiftoffEnv } from "liftoff";
import { join } from "path";

export const getJSONMdTree = (liftEnv: LiftoffEnv) => {
  const { cwd } = liftEnv;
  const docsPath = join(cwd, "/docs");
  const entryPaths = fsUtil.find(cwd, "./*.md");
  const entryFile = entryPaths[0];

  const mdTress: any = {};
  const nodeMap: any = {};

  const entryData = fromMarkdown(fsUtil.read(entryFile));

  const topLink = getEntryLink(entryData);
  const topName = getEntryName(entryData);
  const topObj: any = getNotesPntChldInfo(topLink, topName, cwd);
  mdTress[topObj.key] = topObj;
  nodeMap[topObj.key] = topObj;

  checkChildren(topObj, nodeMap, docsPath, 20);
  fsUtil.write(join(cwd, "/tree.json"), JSON.stringify(mdTress, undefined, 2));
};
