import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Personal Page",
    description: "Personal job companion.",
    appleWebApp: { capable: true, title: "Personal", statusBarStyle: "black-translucent" },
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
    },
};

/** Wraps every route with the shared font, theme providers, and document shell. */
export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${roboto.className} h-full antialiased`} suppressHydrationWarning>
            <body className="min-h-full flex flex-col">
                <InitColorSchemeScript />
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <Providers>{children}</Providers>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
