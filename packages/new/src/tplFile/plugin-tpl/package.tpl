{
  "name": "@credit/{{{pkgName}}}",
  "version": "0.0.0",
  "description": "> TODO: description",
  "author": "yuan.li <yuan.li@shopee.com>",
  "homepage": "",
  "license": "ISC",
  "main": "lib/{{{pkgName}}}.js",
  "types": "lib/index.d.ts",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "publishConfig": {
    "registry": "https://npm.garenanow.com/"
  },
  "repository": {
    "type": "git",
    "url": "gitlab@git.garena.com:shopee/loan-service/credit_frontend/credit-plugins.git"
  },
  "scripts": {
    "test": "echo \"Error: run tests from root\" && exit 1",
    "lint": "eslint 'src/**/*.{js,ts}'",
    "lint:fix": "eslint --fix 'src/**/!(*.test).{js,ts}'",
    "prettier": "prettier --write 'src/**/!(*.test).{js,ts}'",
    "dev": "rollup -c rollup.config.js -w",
    "pub": "lerna publish",
    "build": "rimraf lib; rollup -c rollup.config.js"
  },
  "devDependencies": {
    "@babel/core": "^7.11.0",
    "@babel/plugin-transform-runtime": "^7.11.5",
    "@babel/preset-env": "^7.11.0",
    "@commitlint/cli": "^11.0.0",
    "@commitlint/config-conventional": "^11.0.0",
    "@finance/eslint-config-loan": "^4.0.0",
    "@rollup/plugin-alias": "^3.1.1",
    "@rollup/plugin-babel": "^5.1.0",
    "@rollup/plugin-buble": "^0.21.3",
    "@rollup/plugin-commonjs": "^14.0.0",
    "@rollup/plugin-node-resolve": "^8.4.0",
    "@types/jest": "^26.0.10",
    "@typescript-eslint/eslint-plugin": "^3.7.1",
    "@typescript-eslint/parser": "^3.7.1",
    "bridgetrack": "^1.1.1",
    "commitizen": "^4.1.2",
    "cz-conventional-changelog": "^3.2.0",
    "eslint": "^7.6.0",
    "eslint-config-prettier": "^6.11.0",
    "eslint-import-resolver-alias": "^1.1.2",
    "eslint-import-resolver-typescript": "^2.2.0",
    "eslint-plugin-import": "^2.22.0",
    "eslint-plugin-prettier": "^3.1.4",
    "glob": "^7.1.6",
    "husky": "^4.2.5",
    "jest": "^26.4.2",
    "lint-staged": "^10.4.2",
    "prettier": "^2.0.5",
    "rimraf": "^3.0.2",
    "rollup": "^2.23.0",
    "rollup-plugin-babel": "^4.4.0",
    "rollup-plugin-terser": "^6.1.0",
    "rollup-plugin-typescript2": "^0.27.1",
    "ts-jest": "^26.3.0",
    "tslib": "^2.0.0",
    "typescript": "^4.0.2"
  },
  "dependencies": {
    "@credit/cli-helper": "^0.0.39"
  }
}
