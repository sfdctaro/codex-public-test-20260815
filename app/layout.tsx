import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const sans=Geist({variable:"--font-sans",subsets:["latin"]});
const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});
export const metadata:Metadata={title:"WORLDWISE — 世界時計",description:"世界の主要都市の現在時刻を、美しく正確に確認できる世界時計。",icons:{icon:{url:"/favicon.svg",type:"image/svg+xml"},shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ja"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>}
