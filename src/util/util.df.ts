export interface ILoc {
  x: number;
  y: number;
}

export interface IObject {
  [key: string]: string;
}

export default class UtilDf {
  public static hostName = '';
  /**
   * window innerwidth 가 .env 의 모바일 가로 사이즈와 비교 하여 boolean 을 리턴함
   */

  public static isDev(): boolean {
    return true;
  }

  /**
   * string 값을 http https 인지 리턴함
   * @param str
   */
  public static hasHttpProtocol(str: string): boolean {
    const re = /(http(s)?:\/\/)/gi;
    return re.test(str);
  }

  public static setHostURL(host: string) {
    const reLocalHost = /localhost/;
    const reIPHost = /192.168/;
    if (reLocalHost.test(host) || reIPHost.test(host)) {
      host = 'http://' + host;
    } else {
      host = 'https://' + host;
    }
    UtilDf.hostName = host;
  }

  /**
   * html element 의 절대적 x y 좌표를 리턴
   * @param el
   */
  public static getAbsPos(el: HTMLElement): ILoc {
    let lx = 0,
      ly = 0;
    do {
      lx += el.offsetLeft;
      ly += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    } while (el != null);

    // for (lx =0, ly=0;  el != null;  , );
    return { x: lx, y: ly };
  }

  public static getRegEscapeString(str: string): string {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  }

  /**
   * cookie 값을 셋팅
   * @param name
   * @param value
   * @param days
   */
  public static setCookie(name: string, value: number, days: number): void {
    let expires = '';
    if (days) {
      const date: Date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  /**
   * cookie name 으로 쿠키값을 리턴
   * @param name
   */
  public static getCookie(name: string): string | null {
    const nameLenPlus: number = name.length + 1;
    return (
      document.cookie
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => {
          return cookie.substring(0, nameLenPlus) === `${name}=`;
        })
        .map((cookie) => {
          return decodeURIComponent(cookie.substring(nameLenPlus));
        })[0] || null
    );
  }

  public static getDocumentHeight(): number {
    const body = document.body;
    const html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }

  public static getEventLoc(e: Event): ILoc {
    if (e.type.includes('touch')) {
      return {
        x: (e as TouchEvent).changedTouches[0].clientX,
        y: (e as TouchEvent).changedTouches[0].clientY
      };
    }
    e = e as MouseEvent;

    return {
      x: (e as MouseEvent).clientX,
      y: (e as MouseEvent).clientY
    };
  }

  public static getDiffLoc(target: ILoc, origin: ILoc): number {
    return target.x - origin.x;
  }

  /***
   * 숫자에 대한 자릿수에 따른 0 값을 붙임
   * @param num
   * @param max
   */
  public static getDigit(num: number, max: number): string {
    const numString = `${num}`;
    let rtn = '';

    if (numString.length < max) {
      for (let i = 0; i < max - numString.length; i++) {
        rtn += '0';
      }
    }

    rtn += numString;
    return rtn;
  }

  public static async getIsEnableWebp() {
    await this.loadImage('/image/blank.webp', []);
  }

  public static loadImage = (url: string, target: Array<HTMLImageElement>) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener('load', () => {
        if (target !== null) {
          target.push(image);
        }
        resolve(image);
      });
      image.addEventListener('error', () => {
        reject();
      });

      image.src = url;
    });
  };
}
