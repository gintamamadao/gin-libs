import chalk from 'chalk'

type ColorType = 'red' | 'yellow' | 'green' | 'blue' | 'white'

class LogText {
  tmpText = ''
  label = (s: string) => {
    this.tmpText += `${chalk.white(s)}: `
    return this
  }
  newLine = () => {
    console.log('\n')
    return this
  }
  space = (n: number) => {
    this.tmpText += ' '.repeat(n)
    return this
  }
  text = (...args: any[]) => {
    return this.colorLog(args, 'white')
  }
  red = (...args: any[]) => {
    return this.colorLog(args, 'red')
  }
  yellow = (...args: any[]) => {
    return this.colorLog(args, 'yellow')
  }
  green = (...args: any[]) => {
    return this.colorLog(args, 'green')
  }
  blue = (...args: any[]) => {
    return this.colorLog(args, 'blue')
  }
  colorLog = (valList: any[], color: ColorType) => {
    const str = valList.join(' ')
    this.tmpText += chalk[color](str)
    return this
  }
  show = () => {
    console.log(this.tmpText)
    this.tmpText = ''
    return this
  }
}

export default new LogText()
