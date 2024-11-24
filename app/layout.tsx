import { Toolbar } from "primereact/toolbar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import logo from "./tcc-logo.png";
import Image from "next/image";
import 'primeicons/primeicons.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TCC Hackathon Sep 2024",
  description: "TCC 😀",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const start = <Image src={logo} alt="tcc-logo" height={130} width={130} />;

  const end = (
    <div>
      <a target="_blank" href={"http://thecloud.company/"}>
        <i
          className="pi pi-globe"
          style={{ margin: "0 1rem", cursor: "pointer", color: 'black' }}
        ></i>
      </a>
    </div>
  );

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toolbar
          start={start}
          end={end}
          style={{ padding: "0", width: "100%" }}
        />
        {children}
      </body>
    </html>
  );
}
