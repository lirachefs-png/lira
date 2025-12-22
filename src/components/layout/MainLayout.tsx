'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div
            className={cn(
                "flex-1 w-full transition-all duration-300 relative",
                isCollapsed ? "md:ml-20" : "md:ml-72"
            )}
        >
            {children}
        </div>
    );
}
