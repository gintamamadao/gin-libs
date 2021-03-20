import { basename, dirname, join } from "path";
import fs from "fs";
import shelljs from "shelljs";
import glob from "glob";
import chokidar, { WatchOptions } from "chokidar";

class FsUtil {
  exist = (filePath: string) => {
    return fs.existsSync(filePath);
  };
  write = (filePath: string, content: string) => {
    this.del(filePath);
    this.dir(dirname(filePath));
    fs.writeFileSync(filePath, content);
    return true;
  };
  read = (filePath: string) => {
    if (!this.exist(filePath)) {
      return "";
    }
    return fs.readFileSync(filePath, "utf-8");
  };
  del = (filePath: string) => {
    if (!this.exist(filePath)) {
      return true;
    }
    return shelljs.rm("-rf", filePath);
  };
  dir = (dirPath: string) => {
    if (!this.exist(dirPath)) {
      shelljs.mkdir("-p", dirPath);
    }
  };
  copy = (file: string, dir: string) => {
    if (!this.exist(file)) {
      return;
    }
    this.del(join(dir, basename(file)));
    this.dir(dir);
    shelljs.cp("-R", file, dir);
  };
  copyDir = (dir: string, newdir: string) => {
    if (!this.exist(dir)) {
      return;
    }
    this.del(newdir);
    this.dir(newdir);
    shelljs.cp("-R", `${dir}/*`, newdir);
  };
  find = (cwd: string, pattern = "*") => {
    const filePaths = glob
      .sync(pattern, {
        cwd,
      })
      .map((f) => join(cwd, f));
    return filePaths || [];
  };
  watch = (cwd: string, option?: WatchOptions) => {
    return chokidar.watch(cwd, option);
  };
}

export default new FsUtil();
