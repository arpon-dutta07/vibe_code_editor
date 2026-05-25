
import  {Footer}  from "@/features/home/footer";
import  {Header}  from "@/features/home/header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { GridBackground } from "@/components/ui/grid-background";

export const metadata: Metadata = {
    title: {
        template: "VibeCode - Editor ",
        default: "Code Editor For VibeCoders - VibeCode",
    },
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <GridBackground />

            <main className="z-20 relative w-full pt-0 md:pt-0  ">

                {children}
            </main>
            <Footer />
        </>
    );
}

