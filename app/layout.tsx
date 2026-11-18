import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import Navbar from "@/components/nav/navbar";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Personal Page",
    description: "Personal job companion.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${roboto.className} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <Providers>
                        <Navbar />
                        {children}
                    </Providers>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
