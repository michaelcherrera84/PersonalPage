"use client";

import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
    { label: "Delivery Entry", href: "/papa-johns" },
    { label: "Current Shift", href: "/papa-johns/current-shift" },
];

export default function ShiftTabs() {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = tabs.some((tab) => tab.href === pathname) ? pathname : "/papa-johns";

    return (
        <div className="fixed bottom-5 left-0 w-full flex justify-center">
            <BottomNavigation
                showLabels
                value={activeTab}
                onChange={(_, newValue: string) => router.push(newValue)}
                className="p-3 rounded-2xl border-white/30 border shadow shadow-black/20"
            >
                {tabs.map((tab) => (
                    <BottomNavigationAction key={tab.href} label={tab.label} value={tab.href} className="text-nowrap" />
                ))}
            </BottomNavigation>
        </div>
    );
}
