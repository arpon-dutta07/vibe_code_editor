"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GridShader } from "@/components/ui/grid-shader";
import { Particles } from "@/components/ui/particles";
import { handleGoogleSignIn, handleGithubSignIn } from "@/features/auth/actions/auth-actions";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
    </svg>
  );
}

export default function SignInPage() {
  const heroMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black selection:bg-rose-500/30">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <GridShader mouseRef={heroMouseRef} className="opacity-40" />
        <Particles
          className="absolute inset-0 pointer-events-none"
          quantity={80}
          staticity={50}
          ease={50}
        />
        {/* Glowing Orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-block mb-8 group">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-shadow">
                    <span className="text-white font-black text-xl italic">V</span>
                </div>
                <span className="text-white font-bold text-xl tracking-tighter">VibeCode</span>
             </div>
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-4">
            Welcome <br /> back.
          </h1>
          <p className="text-zinc-500 text-lg">Continue to your workspace</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-1 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 shadow-2xl"
        >
          <div className="p-6 space-y-4">
            <form action={handleGoogleSignIn}>
              <Button 
                type="submit" 
                variant="brand" 
                size="lg"
                className="w-full h-14 rounded-xl text-base font-bold shadow-[0_4px_20px_rgba(244,63,94,0.2)] hover:shadow-[0_6px_28px_rgba(244,63,94,0.4)] transition-all group"
              >
                <GoogleIcon className="mr-3 h-5 w-5" />
                Sign in with Google
                <ArrowRight className="ml-auto h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
            </form>

            <form action={handleGithubSignIn}>
              <Button 
                type="submit" 
                variant="outline" 
                size="lg"
                className="w-full h-14 rounded-xl text-base font-bold border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 text-white transition-all group"
              >
                <Github className="mr-3 h-5 w-5" />
                Sign in with GitHub
                <ArrowRight className="ml-auto h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
            </form>
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
            By signing in, you agree to our{" "}
            <a href="#" className="text-zinc-400 hover:text-rose-500 hover:underline decoration-rose-500/30 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-zinc-400 hover:text-rose-500 hover:underline decoration-rose-500/30 transition-colors">
              Privacy Policy
            </a>.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
