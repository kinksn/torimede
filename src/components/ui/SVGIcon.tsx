import React from "react";

type SVGIconProps = {
  svg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} & React.SVGProps<SVGSVGElement>;

export const SVGIcon = ({ svg: SvgComponent, ...props }: SVGIconProps) => {
  return <SvgComponent {...props} />;
};
