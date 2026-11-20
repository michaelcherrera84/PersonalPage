import { Button } from '@mui/material';
import Link from '@/components/link';

/** Renders the dashboard entry point for the Papa Johns delivery tools. */
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button component={Link} href="/papa-johns">Papa Johns</Button>
    </div>
  );
}
