"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Particles } from "@/components/ui/particles";

const TEAM_MEMBERS = [
  {
    name: "Member One",
    role: "Founding Engineer",
    image: "/member1.jpeg",
  },
  {
    name: "Member Two",
    role: "Product Designer",
      image: "/member2.jpeg",
    },
  {
    name: "Member Three",
    role: "Backend Architect",
    image: "/member3.jpeg",
  },
  {
    name: "Member Four",
    role: "Frontend Engineer",
    image: "/member4.jpeg",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        quantity={80}
        staticity={30}
        ease={50}
      /> */}
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-pink-500 text-sm font-bold uppercase tracking-widest mb-4"
          >
            THE TEAM BEHIND VIBECODE
          </motion.p>
          
          <TypingAnimation
            text="Built by developers, for developers."
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            duration={100}
            delay={3000}
          />
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;re four developers obsessed with speed, flow, and removing every friction point between an idea and working code.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              className="group p-4 rounded-3xl bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:-translate-y-2 hover:border-pink-500/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="relative aspect-square mb-6 overflow-hidden rounded-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white group-hover:text-pink-500 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
