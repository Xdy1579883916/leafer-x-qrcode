import type { IImageData, IImageInputData, IJSONOptions, IObject, IUI } from 'leafer-ui'
import { qrcodegen } from '@dy-kit/qrcodegen'
import {
  boundsType,
  dataProcessor,
  Debug,
  Image,
  ImageData,
  LeaferCanvas,
  Platform,
  Plugin,
  registerUI,
} from 'leafer-ui'

const console = Debug.get('leafer-x-qrcode')

// ==================== Types ====================
export interface IQRCodeAttrData {
  text?: string
  color?: string
  iconSrc?: string
  iconSize?: number
}

export interface IProcessDataType extends IImageData {
  _text?: string
  _color?: string
  _iconSrc?: string
  _iconSize?: number
  __iconBase64?: string
}

export interface IQRCode extends IQRCodeAttrData, IUI {
  __: IProcessDataType
}

export interface IQRCodeInputData extends IQRCodeAttrData, IImageInputData {
}

// ==================== Data Class ====================
type Modules = ReturnType<qrcodegen.QrCode['getModules']>

function generatePath(modules: Modules, margin: number = 0): string {
  const ops: string[] = []
  modules.forEach((row, y) => {
    let start: number | null = null
    row.forEach((cell, x) => {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`,
        )
        start = null
        return
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`)
        }
        else {
          // Otherwise finish the current line.
          ops.push(
            `M${start + margin},${y + margin} h${x + 1 - start}v1H${
              start + margin
            }z`,
          )
        }
        return
      }

      if (cell && start === null) {
        start = x
      }
    })
  })
  return ops.join('')
}

interface ISvgIcon {
  iconSrc?: string
  iconSize?: number
}

interface ISvgInfoResult {
  innerHtml: string
  numCells: number
}

function svgInfo(qr: qrcodegen.QrCode, color: string = '#000', size: number, iconConfig: ISvgIcon | null): ISvgInfoResult {
  const cells = qr.getModules()
  const numCells = cells.length
  const cellsToDraw = cells
  let svgInnerHtml = ''
  const path1Html = `<path fill="transparent" d="M0,0 h${numCells}v${numCells}H0z" shape-rendering="crispEdges"></path>`
  const path2Html = `<path fill="${color}" d="${generatePath(cellsToDraw, 0)}" shape-rendering="crispEdges"></path>`
  let iconHtml = ''
  if (iconConfig) {
    const { iconSrc, iconSize } = iconConfig

    const DEFAULT_IMG_SCALE = 0.1
    const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE)
    const scale = numCells / size
    const h = (iconSize || defaultSize) * scale
    const w = (iconSize || defaultSize) * scale
    const x = cells.length / 2 - w / 2
    const y = cells.length / 2 - h / 2
    iconHtml += `<image href="${iconSrc}" width="${w}" height="${h}" x="${x}" y="${y}" preserveAspectRatio="none"></image>`
  }
  svgInnerHtml += path1Html
  svgInnerHtml += path2Html
  svgInnerHtml += iconHtml
  return {
    innerHtml: svgInnerHtml,
    numCells,
  }
}

function toSvgURL(svgInfo: ISvgInfoResult, size: number) {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${svgInfo.numCells} ${svgInfo.numCells}" role="img" xmlns="http://www.w3.org/2000/svg">
${svgInfo.innerHtml}
</svg>
`
  return Platform.toURL(svg, 'svg')
}

function isBase64(str: string) {
  return /^data:image\/\w+;base64/.test(str)
}

function isURL(str: string) {
  return /^https?:\/\//.test(str)
}

async function toBase64(url: string): Promise<string> {
  const img = await Platform.origin.loadImage(url)
  const canvas = new LeaferCanvas(img)
  canvas.drawImage(img, 0, 0)
  return canvas.toDataURL() as string
}

const DEFAULT_TEXT = '<None>'
const DEFAULT_COLOR = '#000'
const DEFAULT_ICON_SIZE = 20

export class ProcessorData extends ImageData implements IProcessDataType {
  _text?: string
  _color?: string
  _iconSize?: number
  _iconSrc?: string
  // url 转为 base64
  __iconBase64?: string

  get __iconConfig() {
    if (this.__iconBase64) {
      return {
        iconSrc: this.__iconBase64,
        iconSize: this._iconSize || DEFAULT_ICON_SIZE,
      }
    }
    return null
  }

  setText(val?: string) {
    this._text = val
    this.__updateSvgURL()
  }

  setColor(val?: string) {
    this._color = val
    this.__updateSvgURL()
  }

  setIconSrc(val?: string) {
    switch (true) {
      case isURL(val): {
        console.log('url-icon', val)
        this._iconSrc = val
        toBase64(val).then((str) => {
          this.__iconBase64 = str
          this.__updateSvgURL()
        })
        break
      }
      case isBase64(val): {
        console.log('base64-icon', val)
        this._iconSrc = this.__iconBase64 = val
        this.__updateSvgURL()
        break
      }
      default: {
        console.warn('invalid-icon', val)
        this._iconSrc = this.__iconBase64 = null
        this.__updateSvgURL()
      }
    }
  }

  setIconSize(val?: number) {
    this._iconSize = val
    this.__updateSvgURL()
  }

  __updateSvgURL() {
    const ui = this.__leaf
    const text = this._text || DEFAULT_TEXT
    const color = this._color || DEFAULT_COLOR
    const qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.MEDIUM)
    const svg_size = 100
    ui.url = toSvgURL(svgInfo(qr, color, svg_size, this.__iconConfig), svg_size)
  }

  public __getData(): IObject {
    const data: IImageInputData = super.__getData()
    delete data.url
    return data
  }

  public __getInputData(names?: string[] | IObject, options?: IJSONOptions): IObject {
    const data: IImageInputData = super.__getInputData(names, options)
    delete data.url
    return data
  }
}

// ==================== Main Class ====================

@registerUI()
export class QRCode<TConstructorData = IQRCodeInputData> extends Image<TConstructorData> implements IQRCode {
  get __tag() {
    return 'QRCode'
  }

  @dataProcessor(ProcessorData)
  declare public __: IProcessDataType

  @boundsType(DEFAULT_TEXT)
  declare text?: string

  @boundsType(DEFAULT_COLOR)
  declare color?: string

  @boundsType(DEFAULT_ICON_SIZE)
  declare iconSize?: number

  @boundsType(null)
  declare iconSrc?: string

  constructor(data?: TConstructorData) {
    super(data)
  }
}

Plugin.add('leafer-x-qrcode')
