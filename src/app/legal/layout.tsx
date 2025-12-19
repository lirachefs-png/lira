export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0f111a] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="bg-white dark:bg-[#151926] p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5 prose dark:prose-invert max-w-none">
                    {children}
                </div>
            </div>
        </div>
    );
}
