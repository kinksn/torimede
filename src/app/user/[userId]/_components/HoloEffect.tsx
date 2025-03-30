"use client";

import React, { useState, useRef, useEffect } from "react";
import { GlitterAnimation, GlitterData } from "./GlitterAnimation";
import { nanoid } from "nanoid";

const GLITTER_GENERATE_COUNT = 8;

type HoloEffectProps = {
  children: React.ReactNode;
  onParentAnimationComplete?: boolean;
};

export const HoloEffect = ({
  children,
  onParentAnimationComplete = true,
}: HoloEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hyp, setHyp] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [glitters, setGlitters] = useState<GlitterData[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onParentAnimationComplete) return;

    const rect = container.getBoundingClientRect();

    const newGlitters = createGlitters(
      GLITTER_GENERATE_COUNT,
      rect.width,
      rect.height
    );
    setGlitters(newGlitters);

    // リサイズ監視
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 監視対象が複数ある場合でも、ここでは1つだけ見る想定
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          // キラキラ要素を全部再生成する
          setGlitters((prev) => {
            return prev.map(() => createGlitter(width, height));
          });
        }
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [onParentAnimationComplete]);

  // 星がアニメーションし終わったら、新しいキラキラ要素に差し替える
  const handleAnimationComplete = (id: string) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // 差し替え用に新しいキラキラ要素を生成
    const newGlitter = createGlitter(rect.width, rect.height);

    setGlitters((prev) =>
      prev.map((glitter) => (glitter.id === id ? newGlitter : glitter))
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return; // container が null の場合は早期リターン

    // 座標に基づいて回転を更新するヘルパー関数
    const updateRotation = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();

      // ポインターの位置
      const pointerX = clientX - rect.x;
      const pointerY = clientY - rect.y;
      const ratioX = pointerX / rect.width;
      const ratioY = pointerY / rect.height;
      setPointer({ x: ratioX * 100, y: ratioY * 100 });

      // rectの中心からポインターがどれだけ離れているか（hypotenuse:斜辺）
      const hyp =
        (Math.sqrt(Math.pow(ratioX - 0.5, 2) + Math.pow(ratioY - 0.5, 2)) *
          10) /
        7;
      setHyp(hyp);

      // ポインター位置に応じてZ軸の奥行きを変更
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (clientX - centerX) / (rect.width / 2);
      const deltaY = (clientY - centerY) / (rect.height / 2);
      const rotateX = deltaY * 20;
      const rotateY = deltaX * 16;
      setRotation({ x: rotateX, y: rotateY });
    };

    // MouseEvent 用のハンドラー
    const handleMouseMove = (event: MouseEvent) => {
      updateRotation(event.clientX, event.clientY);
    };

    // TouchEvent 用のハンドラー
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      // 最初のタッチポイントを使用
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();

        // タッチ位置
        const pointerX = touch.clientX - rect.x;
        const pointerY = touch.clientY - rect.y;
        const ratioX = pointerX / rect.width;
        const ratioY = pointerY / rect.height;
        setPointer({ x: ratioX * 100, y: ratioY * 100 });

        // rectの中心からタッチ位置がどれだけ離れているか（hypotenuse:斜辺）
        const hyp =
          (Math.sqrt(Math.pow(ratioX - 0.5, 2) + Math.pow(ratioY - 0.5, 2)) *
            10) /
          7;
        setHyp(hyp);

        // タッチ位置に応じてZ軸の奥行きを変更
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (touch.clientX - centerX) / (rect.width / 2);
        const deltaY = (touch.clientY - centerY) / (rect.height / 2);
        // X・Y軸方向の回転をX/Y軸を-25~25に制限
        const rotateX = Math.max(-25, Math.min(25, deltaY * 20));
        const rotateY = Math.max(-25, Math.min(25, deltaX * 20));
        setRotation({ x: rotateX, y: rotateY });
      }
    };

    const handleEnd = () => {
      setRotation({ x: 0, y: 0 });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleEnd);
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleEnd);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleEnd);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleEnd);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    perspective: "600px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(0.99)`,
    transformOrigin: "center center",
    transition: "transform 0.2s ease-out",
  };

  const imageHeghlightStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    transform: "scale(0.99)",
    background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,.8) 10%, rgba(255,255,255,.65) 20%, rgba(0,0,0,.5) 90%)`,
    mixBlendMode: "overlay",
    borderRadius: "19px",
    opacity: isHovering ? 1 : 0,
    transition: "opacity 0.2s ease-out",
    zIndex: 2,
  };

  const imageColorStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: "scale(0.99)",
    backgroundImage: `url(""),
        repeating-linear-gradient( -20deg, 
        rgb(253, 71, 65) 9%, 
        rgb(255, 243, 151) 18%, 
        rgb(95, 255, 180) 27%, 
        rgba(131,255,247,1) 36%, 
        rgb(75, 198, 255) 45%, 
        rgb(255, 73, 246) 54%, 
        rgb(255, 56, 49) 63%
        ),
        repeating-linear-gradient( 130deg, 
        rgba(89, 46, 80, 0.5) 12%, 
        hsl(263, 43%, 76%) 24%, 
        rgb(223, 96, 202) 36%, 
        hsl(180, 57%, 56%) 48%, 
        rgba(14, 21, 46, 0.5) 60%, 
        rgba(14, 21, 46, 0.5) 72% 
        ),
        url("")`,
    backgroundBlendMode: "color-burn, soft-light, normal",
    mixBlendMode: "color-dodge",
    opacity: isHovering ? 0.3 : 0,
    backgroundSize: "20% 15%, 500% 500%, 1000% 1000%, 130% 180%",
    backgroundPosition: `center, calc( ${rotation.x} * 1.5 ) calc( ${rotation.y} * 1.5 ), calc( ${rotation.x} * 1.5 ) ${rotation.y}, bottom left`,
    filter: `brightness(calc((${hyp}*0.25) + 0.66)) contrast(3) saturate(.7)`,
    borderRadius: "19px",
    zIndex: 1,
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
    >
      <div style={imageStyle} className="cardWrapper rounded-lg relative">
        {glitters.map((glitter) => (
          <GlitterAnimation
            key={glitter.id} // ★ glitter.id を key とする
            glitter={glitter}
            onComplete={handleAnimationComplete}
          />
        ))}

        <div style={imageColorStyle} />
        <div style={imageHeghlightStyle} />
        {children}
      </div>
    </div>
  );
};

const createGlitter = (width: number, height: number): GlitterData => {
  // ランダムに fill/stroke
  const type = Math.random() < 0.5 ? "fill" : "stroke";
  // ランダム座標
  const x = Math.random() * (width - 40);
  const y = Math.random() * (height - 40);
  // ランダム遅延 (0〜1s)
  const delay = Math.random() * 1;

  return {
    id: nanoid(),
    x,
    y,
    delay,
    type,
  };
};

const createGlitters = (
  n: number,
  width: number,
  height: number
): GlitterData[] => {
  return Array.from({ length: n }).map(() => createGlitter(width, height));
};
