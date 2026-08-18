import type { SVGProps } from "react";

const ReactNative = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 256 256" preserveAspectRatio="xMidYMid">
    <path
      d="M128 204.638c-42.346 0-76.638-34.292-76.638-76.638S85.654 51.362 128 51.362s76.638 34.292 76.638 76.638-34.292 76.638-76.638 76.638Z"
      fill="#61DAFB"
    />
    <path
      d="M128 23.362c57.924 0 104.875 46.951 104.875 104.875S185.924 233.112 128 233.112 23.125 186.161 23.125 128.237 70.076 23.362 128 23.362Zm0 18.75c-47.569 0-86.125 38.556-86.125 86.125S80.431 214.362 128 214.362s86.125-38.556 86.125-86.125S175.569 42.112 128 42.112Z"
      fill="#61DAFB"
    />
    <ellipse cx="128" cy="128" rx="15" ry="15" fill="#61DAFB" />
    <path
      d="M128 42.112c35.346 0 64 28.654 64 64s-28.654 64-64 64"
      stroke="#61DAFB"
      strokeWidth="8"
      fill="none"
    />
    <path
      d="M128 42.112c-35.346 0-64 28.654-64 64s28.654 64 64 64"
      stroke="#61DAFB"
      strokeWidth="8"
      fill="none"
      transform="rotate(60 128 128)"
    />
    <path
      d="M128 42.112c-35.346 0-64 28.654-64 64s28.654 64 64 64"
      stroke="#61DAFB"
      strokeWidth="8"
      fill="none"
      transform="rotate(120 128 128)"
    />
  </svg>
);

export { ReactNative };
