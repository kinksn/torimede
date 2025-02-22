import { RefObject } from "react";

const LineSvg = `<svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.51562 5.44873C3.51562 6.5533 4.41106 7.44873 5.51562 7.44873L11.5156 7.44873C12.6202 7.44873 13.5156 6.5533 13.5156 5.44873V5.44873C13.5156 4.34416 12.6202 3.44873 11.5156 3.44873L5.51562 3.44873C4.41106 3.44873 3.51562 4.34416 3.51562 5.44873V5.44873Z" fill="url(#paint0_linear_1322_368)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.51562 10.4487H11.5156C14.277 10.4487 16.5156 8.21015 16.5156 5.44873C16.5156 2.68731 14.277 0.448731 11.5156 0.448731H5.51562C2.7542 0.448731 0.515625 2.68731 0.515625 5.44873C0.515625 8.21015 2.7542 10.4487 5.51562 10.4487ZM5.51562 7.44873C4.41106 7.44873 3.51562 6.5533 3.51562 5.44873C3.51562 4.34416 4.41106 3.44873 5.51562 3.44873L11.5156 3.44873C12.6202 3.44873 13.5156 4.34416 13.5156 5.44873C13.5156 6.5533 12.6202 7.44873 11.5156 7.44873H5.51562Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_1322_368" x1="4.21818" y1="4.65133" x2="14.445" y2="3.91232" gradientUnits="userSpaceOnUse">
<stop stop-color="#F9DF5A"/>
<stop offset="1" stop-color="#FFB464"/>
</linearGradient>
</defs>
</svg>`;

const HeartSvg = `<svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.86641 13.608C9.18807 13.7679 9.27422 13.8641 9.51562 13.8641C9.75703 13.8641 9.85889 13.7721 10.1648 13.608C12.078 12.2721 15.5156 10.019 15.5156 6.93642C15.5156 5.29437 14.332 3.89428 12.7172 3.62412C11.6484 3.44559 10.5517 4.10047 9.78765 4.86629L9.64798 5.00628C9.56984 5.0846 9.44296 5.0846 9.36482 5.00628L9.22515 4.86629C8.46109 4.10047 7.38281 3.44559 6.31406 3.62412C4.69922 3.89428 3.51562 5.29437 3.51562 6.93642C3.51562 10.019 6.88856 12.174 8.86641 13.608Z" fill="url(#paint0_linear_1322_367)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.30744 16.1832L7.10549 16.0368C6.98216 15.9474 6.84323 15.8485 6.69186 15.7407C5.7879 15.0969 4.43991 14.1369 3.3156 12.9993C1.99447 11.6626 0.515625 9.63233 0.515625 6.93642C0.515625 3.83341 2.75369 1.17806 5.81906 0.665244L5.81976 0.665127C7.2453 0.426989 8.50626 0.805245 9.51017 1.35526C10.5213 0.804131 11.788 0.427328 13.2115 0.665127L13.2122 0.665244C16.2776 1.17806 18.5156 3.83341 18.5156 6.93642C18.5156 9.63708 17.0149 11.6921 15.6952 13.0322C14.4809 14.2653 13.0471 15.2596 12.1368 15.8909C12.0466 15.9534 11.9615 16.0124 11.8824 16.0677L11.7379 16.1686L11.5827 16.2518C11.5517 16.2684 11.5307 16.2803 11.4899 16.3033C11.4758 16.3113 11.4593 16.3206 11.4391 16.3319L11.4346 16.3345C11.3761 16.3674 11.2383 16.445 11.0773 16.5195C10.8921 16.6054 10.649 16.7011 10.3531 16.7697C10.0554 16.8387 9.77403 16.8641 9.51562 16.8641C9.24711 16.8641 8.95425 16.8363 8.64465 16.7606C8.33936 16.6859 8.09585 16.5834 7.92529 16.5017C7.79536 16.4395 7.66968 16.3696 7.62932 16.3472C7.62542 16.345 7.62231 16.3433 7.62008 16.3421C7.57058 16.3147 7.55111 16.3044 7.5308 16.2943L7.30744 16.1832ZM12.7172 3.62412C14.332 3.89428 15.5156 5.29437 15.5156 6.93642C15.5156 9.88835 12.3632 12.0797 10.4159 13.4332C10.3297 13.4931 10.2459 13.5514 10.1648 13.608C10.1031 13.6411 10.0497 13.6713 10.0018 13.6983C9.81211 13.8054 9.70833 13.8641 9.51562 13.8641C9.33868 13.8641 9.24514 13.8124 9.08114 13.7219C9.02139 13.6889 8.95229 13.6507 8.86641 13.608C8.71556 13.4986 8.55661 13.3851 8.39165 13.2672C6.3937 11.8399 3.51562 9.7839 3.51562 6.93642C3.51562 5.29437 4.69922 3.89428 6.31406 3.62412C7.38281 3.44559 8.46109 4.10047 9.22515 4.86629L9.36481 5.00628C9.44296 5.0846 9.56984 5.0846 9.64798 5.00628L9.78765 4.86629C10.5517 4.10047 11.6484 3.44559 12.7172 3.62412Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_1322_367" x1="9.525" y1="3.44964" x2="9.525" y2="13.7354" gradientUnits="userSpaceOnUse">
<stop stop-color="#F57D7D"/>
<stop offset="0.685" stop-color="#EBA080"/>
<stop offset="1" stop-color="#FFD57B"/>
</linearGradient>
</defs>
</svg>
`;

const dotSvg = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.51562 7.11914C3.51562 9.32828 5.30649 11.1191 7.51562 11.1191C9.72476 11.1191 11.5156 9.32828 11.5156 7.11914C11.5156 4.91 9.72476 3.11914 7.51562 3.11914C5.30649 3.11914 3.51562 4.91 3.51562 7.11914Z" fill="#FDB33C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.515625 7.11914C0.515625 10.9851 3.64963 14.1191 7.51562 14.1191C11.3816 14.1191 14.5156 10.9851 14.5156 7.11914C14.5156 3.25315 11.3816 0.119141 7.51562 0.119141C3.64963 0.119141 0.515625 3.25315 0.515625 7.11914ZM7.51562 11.1191C5.30649 11.1191 3.51562 9.32828 3.51562 7.11914C3.51562 4.91 5.30649 3.11914 7.51562 3.11914C9.72476 3.11914 11.5156 4.91 11.5156 7.11914C11.5156 9.32828 9.72476 11.1191 7.51562 11.1191Z" fill="white"/>
</svg>
`;

const appendAll = (parentRef: RefObject<Element>, elems: Element[]) => {
  const parent = parentRef.current;
  if (parent) {
    elems.forEach((elem) => parent.appendChild(elem));
  }
};

const removeAll = (elems: Element[]) => {
  elems.forEach((elem) => elem.parentNode?.removeChild(elem));
};

const createElementsWithClass = (
  count: number,
  tagName = "div",
  className = "",
  element: string
) => {
  return Array(count)
    .fill(0)
    .map(() => {
      const elem = document.createElement(tagName);
      elem.className = className;
      elem.innerHTML = element;
      return elem;
    });
};

export const emitParticles = async (centerRef: RefObject<Element>) => {
  // div.dotをCOUNT個作成

  // Line SVGの要素を作成
  const lines = createElementsWithClass(
    4,
    "div",
    "absolute w-[17px] h-[11px] -left-[8.2px] -top-[5.2px]",
    LineSvg
  );

  // Heart SVGの要素を作成
  const hearts = createElementsWithClass(
    3,
    "div",
    "absolute w-[19px] h-[17px] -left-[9.5px] -top-[8.5px]",
    HeartSvg
  );

  // Dot SVGの要素を作成
  const dots = createElementsWithClass(
    5,
    "div",
    "absolute w-[15px] h-[15px] -left-[7.5px] -top-[7.5px]",
    dotSvg
  );

  appendAll(centerRef, [...lines, ...hearts, ...dots]); // 画面に表示

  const animateElements = (
    elements: Element[],
    options: {
      angle?: number;
      dist?: number;
      size?: number;
      duration?: number;
    } = {}
  ) => {
    const defaultOptions = {
      angle: 360,
      dist: 58,
      size: 1,
      duration: 600,
    };

    return elements.map((elem) => {
      const angle = options.angle ?? defaultOptions.angle * Math.random();
      const dist = options.dist ?? defaultOptions.dist + Math.random() * 50;
      const size =
        options.size ?? defaultOptions.size + 0.1 + (0.5 - 0.1) * Math.random();
      return elem.animate(
        [
          {
            transform: `rotate(${angle}deg) translateX(0px) scale(${size})`,
            opacity: 0.8,
          },
          {
            transform: `rotate(${angle}deg) translateX(${
              dist * 0.8
            }px) scale(${size})`,
            opacity: 0.8,
            offset: 0.8,
          },
          {
            transform: `rotate(${angle}deg) translateX(${dist}px) scale(${size})`,
            opacity: 0,
          },
        ],
        {
          duration: options.duration ?? defaultOptions.duration,
          fill: "forwards",
        }
      );
    });
  };

  // 各SVGのアニメーションを実行
  const lineAnimation = animateElements(lines);
  const heartAnimation = animateElements(hearts, {
    duration: 800,
    dist: 59 + Math.random() * 50,
  });
  const dotAnimation = animateElements(dots, { size: 1, duration: 700 });

  // 全てのアニメーションが終わるまで待つ
  await Promise.all([
    ...lineAnimation.map((anim) => anim.finished),
    ...heartAnimation.map((anim) => anim.finished),
    ...dotAnimation.map((anim) => anim.finished),
  ]);

  // すべての要素を削除
  removeAll([...lines, ...hearts, ...dots]); // 削除
};
