import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Personal Page",
        short_name: "Personal Page",
        description: "Companion site for work data.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#171717"
    }
}