import { Card, CardContent, Typography } from "@mui/material";
import link from "@/components/link";

type Props = {
    title?: string;
    children: React.ReactNode;
    isLink?: boolean;
    href?: string;
};

/** Renders a card for the dashboard, optionally linking to another page. */
export default function DashboardCard({ title, children, isLink = false, href }: Props) {
    return (
        <Card className="min-w-54 min-h-42 p-2" component={isLink ? link : "div"} href={href ?? "#"}>
            <CardContent className="flex flex-col h-full gap-3">
                {title && (
                    <Typography variant="h3" className="text-xl font-bold">
                        {title}
                    </Typography>
                )}
                <div className="h-full">{children}</div>
            </CardContent>
        </Card>
    );
}
