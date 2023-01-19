import ControlEvent from './control.event';
import UtilDf, { ILoc } from './../util/util.df';

const enum TYPE_DRAG {
  NONE,
  HORIZONTAL,
  VERTICAL
}

export default class ControlSlider {
  public el: HTMLElement | null = null;
  public ulEl: HTMLElement | null = null;
  public liEls: Array<HTMLElement> = [];
  private callBackFn: ((index: number) => void) | null = null;
  public controlEvent: ControlEvent = new ControlEvent();

  private isInfinite = false;

  public itemWidth = 0;

  public currentColumnSize = 1;
  public currentIndex = 0;
  public totalIndex = 0;
  public isDrag = false;

  private startLoc: ILoc = { x: 0, y: 0 };
  private moveLoc: ILoc = { x: 0, y: 0 };

  public targetX = 0;

  private dragType: TYPE_DRAG = TYPE_DRAG.NONE;

  /***
   * slider 제어를 할수 있는  Container는
   * CSSContent로 만들어지거나 grid template 을 사용하는 HTMLElement
   * 그리고 Slider item 을 ul > li의 구조로 가지고 있어야함.
   * @file Slider.tsx 참조
   * @param el  Container HTML Element
   * @param callBackFn  현재 포커스된 index 값을 리턴하는 콜백 함수
   * @param isInfinite  무한 롤링 여부
   */
  public init(
    el: HTMLElement,
    callBackFn: (index: number) => void,
    isInfinite = false
  ) {
    if (this.el) return;

    this.el = el;
    this.callBackFn = callBackFn;
    this.isInfinite = isInfinite;

    this.ulEl = this.el.querySelector('ul');
    this.setLiEls();

    this.totalIndex = this.liEls?.length ? this.liEls.length : 0;
    this.setEvent();

    // 무한 스크롤일 경우 중간으로 이동
    if (this.isInfinite) {
      this.currentIndex = Math.floor(this.totalIndex / 4);
    }

    this.setResize();
  }

  private setLiEls() {
    if (!this.ulEl) return;

    this.liEls = [];

    this.itemWidth = 0;

    this.ulEl.querySelectorAll('li').forEach((el, index) => {
      const tmpParentNode = el.parentNode;
      if (tmpParentNode === this.ulEl) {
        if (index === 0) {
          this.itemWidth = el.offsetWidth;
          el.style.position = 'relative';
        } else {
          el.style.position = 'absolute';
        }
        this.liEls.push(el);
      }
    });
  }

  public setDestroy() {
    this.controlEvent.setDestroy();
    this.el = null;
  }

  public setPrev(size = 1): void {
    if (this.isInfinite) {
      this.currentIndex -= size;
    } else {
      this.currentIndex =
        this.currentIndex - size <= 0 ? 0 : this.currentIndex - size;
    }
    this.setSnap();
    this.setX(true);
  }

  public setNext(size = 1): void {
    if (this.isInfinite) {
      this.currentIndex += size;
    } else {
      this.currentIndex =
        this.currentIndex + size >= this.totalIndex - this.currentColumnSize
          ? this.totalIndex - this.currentColumnSize
          : this.currentIndex + size;
    }

    this.setSnap();
    this.setX(true);
  }

  private onDownHandler = (e: Event) => {
    this.isDrag = true;
    this.startLoc = UtilDf.getEventLoc(e);
    this.moveLoc = UtilDf.getEventLoc(e);
  };

  private onMoveHandler = (e: Event) => {
    if (!this.isDrag) return;
    const loc = UtilDf.getEventLoc(e);
    const diff = UtilDf.getDiffLoc(this.moveLoc, loc);
    this.targetX -= diff;
    this.moveLoc = loc;

    if (Math.abs(this.startLoc.x - loc.x) > 10) {
      this.dragType = TYPE_DRAG.HORIZONTAL;
    } else if (Math.abs(this.startLoc.y - loc.y) > 10) {
      this.dragType = TYPE_DRAG.VERTICAL;
      this.setSnap();
      this.setX(true);
      this.isDrag = false;
      return false;
    }

    this.setX(false);
  };

  private onUpHandler = (e: Event) => {
    if (!this.isDrag) return;
    this.isDrag = false;
    this.moveLoc = UtilDf.getEventLoc(e);
    const diff = UtilDf.getDiffLoc(this.moveLoc, this.startLoc);
    const size = Math.abs(diff / this.itemWidth);

    if (diff > 10) {
      this.setPrev(Math.ceil(size));
      return false;
    } else if (diff < -10) {
      this.setNext(Math.ceil(size));
      return false;
    }

    this.setSnap();
    this.setX(true);
  };

  public setSnap() {
    if (!this.isInfinite) {
      if (this.currentIndex > this.totalIndex - this.currentColumnSize) {
        this.currentIndex = this.totalIndex - this.currentColumnSize;
      }
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      }
    }
    this.targetX = this.currentIndex * this.itemWidth * -1;
    if (this.callBackFn) {
      // console.log('setSnap : ' + this.currentIndex);
      this.callBackFn(this.currentIndex);
    }
  }

  public setCurrentIndex(index: number) {
    // console.log('setCurrentIndex : ' + index);
    this.currentIndex = index;
    this.setSnap();
    this.setX(true);
  }

  public setX(isAnimate: boolean) {
    if (!this.ulEl) return;
    const duration = isAnimate ? '0.2s' : '0s';
    this.ulEl.style.transition = `transform ${duration}`;
    this.ulEl.style.transform = `translate3d( ${this.targetX}px, 0, 0)`;
  }

  private onResizeHandler = () => {
    this.setResize();
  };

  /***
   * stateContentSize hook 에서 resize 시에 item width 를 구하도록 함
   */
  public setResize(): void {
    if (!this.ulEl) return;
    if (!this.liEls) return;

    const parentNode = this.ulEl.parentNode
      ? (this.ulEl.parentNode as HTMLElement)
      : undefined;

    if (this.liEls[0]) {
      this.itemWidth = this.liEls[0].offsetWidth;
    }
    if (parentNode) {
      this.currentColumnSize = Math.floor(
        parentNode?.offsetWidth / this.itemWidth
      );
    }

    this.liEls.forEach((liEl, index) => {
      liEl.style.left = `${index * this.itemWidth}px`;
    });

    this.setSnap();
    this.setX(false);
  }

  private onTransitionEndHandler = (e: Event) => {
    if (!this.ulEl) return;
    if (!this.isInfinite) return;

    //  transition 이 끝나는 객체가 ulEl 일 경우 infinite loop 를 위해 위치 값을 변경함.
    if (e.target === this.ulEl) {
      if (this.currentIndex < this.totalIndex / 4) {
        this.currentIndex += this.totalIndex / 4;
        this.setSnap();
        this.setX(false);
      }
      if (this.currentIndex > (this.totalIndex / 4) * 2) {
        this.currentIndex -= this.totalIndex / 4;
        this.setSnap();
        this.setX(false);
      }
    }
  };

  public setEvent(): void {
    if (!this.el) return;

    window.addEventListener('onResize', this.onResizeHandler);
    this.controlEvent.addHandler(
      this.el,
      'transitionend',
      this.onTransitionEndHandler
    );

    if (navigator.maxTouchPoints > 0) {
      this.controlEvent.addHandler(this.el, 'touchstart', this.onDownHandler);
      this.controlEvent.addHandler(this.el, 'touchmove', this.onMoveHandler);
      this.controlEvent.addHandler(this.el, 'touchend', this.onUpHandler);
      this.controlEvent.addHandler(this.el, 'touchcancel', this.onUpHandler);
    } else {
      this.controlEvent.addHandler(this.el, 'mousedown', this.onDownHandler);
      this.controlEvent.addHandler(this.el, 'mousemove', this.onMoveHandler);
      this.controlEvent.addHandler(this.el, 'mouseup', this.onUpHandler);
      this.controlEvent.addHandler(this.el, 'mouseleave', this.onUpHandler);
    }
  }
}
