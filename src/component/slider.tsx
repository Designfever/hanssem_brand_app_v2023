import { useEffect, useMemo, useRef, useState } from 'react';
import ControlSlider from '../control/control.slider';

interface IProps {
  columnSize: number | Array<number>;
  mobileColumnSize?: number;
  isInfinite?: boolean;
  children?: React.ReactNode;
  isPadding?: boolean;
  desktopGapSize?: number;
  mobileGapSize?: number;
  getCurrentFocus?: (no: number) => void;
  setCurrentFocus?: number | undefined;
  desktopPaddingSize?: number;
  mobilePaddingSize?: number;
}

const Slider: React.FC<IProps> = (props) => {
  const refEl = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const controlSlider = useMemo(() => {
    return new ControlSlider();
  }, []);

  useEffect(() => {
    //0 값으로 처리할 경우 1페이지가 안눌러지는 버그 수정
    if (props.setCurrentFocus !== undefined) {
      controlSlider.setCurrentIndex(props.setCurrentFocus);
      setCurrentIndex(props.setCurrentFocus);
    }
  }, [props.setCurrentFocus, setCurrentIndex, controlSlider]);

  useEffect(() => {
    if (!refEl.current) return;
    controlSlider.init(refEl.current, setCurrentIndex, props.isInfinite);
    return () => {
      controlSlider.setDestroy();
    };
  }, [controlSlider, props.isInfinite, props.children]);

  useEffect(() => {
    if (props.getCurrentFocus) {
      props.getCurrentFocus(currentIndex);
    }
  }, [currentIndex, props]);

  return (
    <div ref={refEl}>
      <ul>{props.children}</ul>
    </div>
  );
};

export default Slider;
