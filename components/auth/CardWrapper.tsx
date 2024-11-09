"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Jost } from "next/font/google";
import BackButton from "./BackButton";
import Header from "../common/Logo";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const font = Jost({
  subsets: ["latin"],
  weight: ["700"],
});

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card
    className={cn(
      "w-full max-w-[800px] min-h-[500px] mx-auto relative overflow-hidden",
      "bg-gradient-to-br from-black via-red-950 to-red-900",
      "border-0 shadow-2xl",
      "transition-all duration-300",
      "md:flex md:flex-row",
      "rounded-xl",
      font.className
    )}
    >
    {/* Left decorative panel - visible on md and above */}
    <div className="hidden md:flex md:w-1/9 relative overflow-hidden bg-black">
    {/* Logo-inspired design element */}
    <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-red-950 to-transparent opacity-70" />
    <div 
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48"
    style={{
      background: `
                radial-gradient(circle at center, #FF0000 0%, transparent 70%),
                radial-gradient(circle at center, #8B0000 20%, transparent 90%)
              `,
      filter: 'blur(20px)'
    }}
    />
    </div>
    
    {/* Decorative lines */}
    <div className="absolute inset-0">
    <div className="absolute top-20 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
    <div className="absolute bottom-20 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
    </div>
    </div>
    
    {/* Main content container */}
    <div className="flex-1 flex flex-col min-h-full relative">
    {/* Animated gradient overlay */}
    <div className="absolute inset-0 pointer-events-none">
    <div 
    className="absolute inset-0 opacity-30"
    style={{
      background: `
                linear-gradient(135deg, transparent 0%, rgba(255, 0, 0, 0.1) 50%, transparent 100%),
                radial-gradient(circle at 70% 30%, rgba(255, 0, 0, 0.1) 0%, transparent 60%)
              `
    }}
    />
    </div>
    
    {/* Content layout */}
    <div className="flex-1 flex flex-col p-6 space-y-8">
    <CardHeader className="p-0">
    <Header label={headerLabel} />
    </CardHeader>
    
    <CardContent className="flex-1 p-0">
    {children}
    </CardContent>
    
    {showSocial && (
      <CardFooter className="p-0">
      {/* <Social /> */}
      </CardFooter>
    )}
    
    <CardFooter className="p-0 pt-4 border-t border-red-900/20 text-white/70">
    <BackButton 
    href={backButtonHref} 
    label={backButtonLabel}
    />
    </CardFooter>
    </div>
    </div>
    </Card>
  );
};

export default CardWrapper;