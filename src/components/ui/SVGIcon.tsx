import React from "react";

type SVGIconProps = {
  svg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
};

export const SVGIcon = ({
  svg: SvgComponent,
  className = "",
  ...props
}: SVGIconProps) => {
  return <SvgComponent className={className} {...props} />;
};
