"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LinkCard } from "@/components/ui/card-26";
import * as PricingCard from "@/components/ui/pricing-card";
import { CheckCircle2, XCircleIcon, Code2, Zap, Users } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import for Lenis
    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    });
  }, []);

  return (
    <div ref={containerRef} className="z-20 flex flex-col items-center justify-start w-full">
      {/* Original Landing Page - Extended with Get Started */}
      <div className="z-20 flex flex-col items-center justify-center min-h-screen py-8 w-full px-4">
        <motion.div
          className="flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image src={"/hero.svg"} alt="Hero-Section" height={400} width={400} />
          </motion.div>

          <motion.h1
            className=" z-20 text-5xl md:text-6xl mt-4 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight leading-[1.3] "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Vibe Code With with Intelligence
          </motion.h1>
        </motion.div>

        <motion.p
          className="mt-6 text-base md:text-lg text-center text-gray-600 dark:text-gray-400 px-5 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          VibeCode Editor is a powerful and intelligent code editor that enhances
          your coding experience with advanced features and seamless integration.
          It is designed to help you write, debug, and optimize your code
          efficiently.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Link href={"/dashboard"}>
            <Button variant={"brand"} className="mt-6" size={"lg"}>
              Get Started
              <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Extended Content - Features Section with Interactive Cards */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight">
            Powerful Features
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Everything you need to write better code faster
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[
              {
                title: "AI-Powered Code",
                description:
                  "Intelligent code completions powered by advanced AI that learns from your patterns.",
                imageUrl:
                  "/5.png",
              },
              {
                title: "Real-time Collaboration",
                description:
                  "Work together with your team instantly with live synchronization.",
                imageUrl:
                  "/6.png",
              },
              {
                title: "Multi-Language",
                description:
                  "Support for all major programming languages with syntax highlighting.",
                imageUrl:
                  "/7.png",
              },
              {
                title: "Smart Debugging",
                description:
                  "Advanced breakpoints and step-by-step execution controls.",
                imageUrl:
                  "/8.png",
              },
              {
                title: "Cloud Integration",
                description:
                  "Seamlessly integrate with your favorite cloud services.",
                imageUrl:
                  "/9.png",
              },
              {
                title: "Performance Analytics",
                description:
                  "Detailed metrics and optimization suggestions for your code.",
                imageUrl:
                  "/10.png",
              },
            ].map((feature, index) => (
              <LinkCard
                key={index}
                title={feature.title}
                description={feature.description}
                imageUrl={feature.imageUrl}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-gray-50 to-transparent dark:from-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight">
            Why Developers Love VibeCode
          </h2>

          <div className="space-y-8">
            {[
              {
                number: "01",
                title: "Boost Your Productivity",
                description:
                  "Reduce boilerplate code and repetitive tasks by 50%. Our intelligent suggestions and automation features help you focus on what matters most.",
              },
              {
                number: "02",
                title: "Code Quality at Scale",
                description:
                  "Maintain code quality across your entire project with real-time linting, formatting, and best practice recommendations.",
              },
              {
                number: "03",
                title: "Seamless Integration",
                description:
                  "Works with your existing tools and workflows. Integrate with Git, Docker, CI/CD pipelines, and your favorite extensions.",
              },
              {
                number: "04",
                title: "Learn as You Code",
                description:
                  "Improve your coding skills with inline documentation, code examples, and personalized learning suggestions.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-2xl',
                  'bg-linear-to-b from-white/90 via-gray-50/90 to-white/90 dark:from-zinc-900/90 dark:via-zinc-800/90 dark:to-zinc-900/90',
                  'shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]',
                  'backdrop-blur-md',
                  'border border-[rgba(230,230,230,0.7)] dark:border-[rgba(70,70,70,0.7)]',
                  'p-8 transition-all hover:shadow-lg'
                )}
              >
                <div className="flex gap-8 items-start">
                  <div className="text-4xl font-bold text-rose-500 dark:text-rose-400 flex-shrink-0">
                    {benefit.number}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight">
            Perfect For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {[
              {
                title: "Individual Developers",
                description: "Build projects faster, level up your skills, manage multiple codebases.",
                imageUrl:
                  "/1.png",
              },
              {
                title: "Development Teams",
                description: "Ship features faster, maintain consistency, code review in real-time.",
                imageUrl:
                  "/2.png",
              },
              {
                title: "Enterprise Organizations",
                description: "Self-hosted deployment, advanced security, SSO & team management.",
                imageUrl:
                  "/3.png",
              },
              {
                title: "Educators & Students",
                description: "Interactive lessons, assignment management, peer code review.",
                imageUrl:
                  "/4.png",
              },
            ].map((useCase, index) => (
              <LinkCard
                key={index}
                title={useCase.title}
                description={useCase.description}
                imageUrl={useCase.imageUrl}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Choose the plan that empowers your coding journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {/* Starter Plan */}
            <PricingCard.Card>
              <PricingCard.Header>
                <PricingCard.Plan>
                  <PricingCard.PlanName>
                    <Code2 aria-hidden="true" />
                    <span>Starter</span>
                  </PricingCard.PlanName>
                </PricingCard.Plan>
                <PricingCard.Description>
                  Perfect for learning and experimentation
                </PricingCard.Description>
                <PricingCard.Price>
                  <PricingCard.MainPrice>Free</PricingCard.MainPrice>
                </PricingCard.Price>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </PricingCard.Header>
              <PricingCard.Body>
                <PricingCard.List>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>1 Active Project</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Basic AI Code Suggestions</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Syntax Highlighting (20+ Languages)</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>1 GB Cloud Storage</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Community Support</span>
                  </PricingCard.ListItem>
                </PricingCard.List>
                <PricingCard.Separator>Starter Features</PricingCard.Separator>
                <PricingCard.List>
                  <PricingCard.ListItem className="opacity-60">
                    <span className="mt-0.5">
                      <XCircleIcon
                        className="h-4 w-4 text-red-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Real-time Collaboration</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem className="opacity-60">
                    <span className="mt-0.5">
                      <XCircleIcon
                        className="h-4 w-4 text-red-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Advanced AI Features</span>
                  </PricingCard.ListItem>
                </PricingCard.List>
              </PricingCard.Body>
            </PricingCard.Card>

            {/* Professional Plan */}
            <PricingCard.Card>
              <PricingCard.Header>
                <PricingCard.Plan>
                  <PricingCard.PlanName>
                    <Zap aria-hidden="true" />
                    <span>Professional</span>
                  </PricingCard.PlanName>
                  <PricingCard.Badge>Most Popular</PricingCard.Badge>
                </PricingCard.Plan>
                <PricingCard.Description>
                  For developers and small teams
                </PricingCard.Description>
                <PricingCard.Price>
                  <PricingCard.MainPrice>$15</PricingCard.MainPrice>
                  <PricingCard.Period>/ month</PricingCard.Period>
                </PricingCard.Price>
                <Button
                  className={cn(
                    "w-full font-semibold text-white",
                    "bg-gradient-to-b from-rose-500 to-pink-500 shadow-[0_10px_25px_rgba(244,63,94,0.3)]"
                  )}
                >
                  Get Started
                </Button>
              </PricingCard.Header>
              <PricingCard.Body>
                <PricingCard.List>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Unlimited Projects</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Advanced AI Code Completions</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Real-time Code Collaboration</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>100 GB Cloud Storage</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Git Integration & Version Control</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Code Review & Comments</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Performance Analytics Dashboard</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Up to 5 Team Members</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Priority Email Support</span>
                  </PricingCard.ListItem>
                </PricingCard.List>
              </PricingCard.Body>
            </PricingCard.Card>

            {/* Enterprise Plan */}
            <PricingCard.Card>
              <PricingCard.Header>
                <PricingCard.Plan>
                  <PricingCard.PlanName>
                    <Users aria-hidden="true" />
                    <span>Enterprise</span>
                  </PricingCard.PlanName>
                </PricingCard.Plan>
                <PricingCard.Description>
                  For large organizations and teams
                </PricingCard.Description>
                <PricingCard.Price>
                  <PricingCard.MainPrice>Custom</PricingCard.MainPrice>
                </PricingCard.Price>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </PricingCard.Header>
              <PricingCard.Body>
                <PricingCard.List>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Everything in Professional</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Unlimited Team Members</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Unlimited Cloud Storage</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Single Sign-On (SSO)</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Advanced Security Controls</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Role-Based Access Control</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>API Access & Webhooks</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Advanced Audit Logs</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Dedicated Account Manager</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>24/7 Priority Support</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Self-Hosted Infrastructure</span>
                  </PricingCard.ListItem>
                  <PricingCard.ListItem>
                    <span className="mt-0.5">
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        aria-hidden="true"
                      />
                    </span>
                    <span>SLA Guarantee</span>
                  </PricingCard.ListItem>
                </PricingCard.List>
              </PricingCard.Body>
            </PricingCard.Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "Is VibeCode available for offline use?",
                answer:
                  "Yes! VibeCode supports offline editing for all your projects. Changes sync automatically when you reconnect to the internet.",
              },
              {
                question: "Can I use VibeCode on my own server?",
                answer:
                  "Absolutely. Enterprise plans include self-hosted and on-premise deployment options with full customization.",
              },
              {
                question: "What languages does VibeCode support?",
                answer:
                  "VibeCode supports all major programming languages including JavaScript, Python, Java, C++, Go, Rust, TypeScript, and 50+ more.",
              },
              {
                question: "How secure is my code?",
                answer:
                  "We use end-to-end encryption, SOC 2 compliance, regular security audits, and follow industry best practices to keep your code safe.",
              },
              {
                question: "Can I migrate from my existing editor?",
                answer:
                  "Yes! We provide migration tools and support for popular editors. Your settings and extensions can be imported automatically.",
              },
              {
                question: "Do you offer API access?",
                answer:
                  "Yes! Professional and Enterprise plans include full API access for integrations and automation.",
              },
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(
                  'rounded-2xl overflow-hidden transition-all',
                  'border border-[rgba(230,230,230,0.7)] dark:border-[rgba(70,70,70,0.7)]',
                  'data-[state=open]:bg-linear-to-b data-[state=open]:from-white/90 data-[state=open]:via-gray-50/90 data-[state=open]:to-white/90 dark:data-[state=open]:from-zinc-900/90 dark:data-[state=open]:via-zinc-800/90 dark:data-[state=open]:to-zinc-900/90',
                  'data-[state=open]:shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]',
                  'data-[state=open]:backdrop-blur-md',
                  'px-6'
                )}
              >
                <AccordionTrigger className="text-lg font-bold text-gray-900 dark:text-white hover:text-rose-500 dark:hover:text-rose-400 transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight">
            Ready to Code With Intelligence?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of developers who are already using VibeCode to write better code faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/dashboard"}>
              <Button variant={"brand"} size={"lg"}>
                Start Free
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button variant={"outline"} size={"lg"}>
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
