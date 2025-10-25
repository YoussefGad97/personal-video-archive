import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      {/* Content */}
      <div className="container relative z-10 px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Your Personal
              </span>
              <br />
              Video Archive
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Organize, discover, and enjoy your video collection in one beautiful place.
              Create playlists, tag favorites, and access your content anywhere.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Visual content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Grid of video thumbnails */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="aspect-video rounded-lg bg-card shadow-lg transform rotate-[-4deg] hover:rotate-[-2deg] transition-transform">
                <div className="w-full h-full bg-primary/20 rounded-lg" />
              </div>
              <div className="aspect-video rounded-lg bg-card shadow-lg transform rotate-[4deg] hover:rotate-[2deg] transition-transform">
                <div className="w-full h-full bg-primary/30 rounded-lg" />
              </div>
              <div className="aspect-video rounded-lg bg-card shadow-lg transform rotate-[2deg] hover:rotate-[0deg] transition-transform">
                <div className="w-full h-full bg-primary/40 rounded-lg" />
              </div>
              <div className="aspect-video rounded-lg bg-card shadow-lg transform rotate-[-2deg] hover:rotate-[0deg] transition-transform">
                <div className="w-full h-full bg-primary/25 rounded-lg" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-primary/10 blur-3xl -z-10 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
    </section>
  );
}