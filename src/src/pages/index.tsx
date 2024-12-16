import { Noto_Sans_JP } from "next/font/google";

const NotoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--noto-sans-jp",
});

export default function Home() {
  return (
    <div
      className={NotoSansJP.className}
    >
      <h1>Hello World</h1>
    </div>
  );
}
