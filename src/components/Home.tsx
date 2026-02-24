import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Upload, Hammer, ShieldCheck, Layers, Cloud } from "lucide-react"

export default function Home() {
  return (
    <div className="text-(--reverse) w-full">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              LFU Sys
            </h1>
            <p className="text-lg sm:text-xl opacity-80 leading-relaxed">
              A distributed large file upload system built for scale,
              correctness, and predictable performance.
            </p>
            <p className="opacity-70 leading-relaxed">
              LFU Sys coordinates chunked uploads across microservices, ensuring
              reliability under load while keeping the architecture explicit and
              understandable.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                to="#"
                className="text-gray-500 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
              >
                Read the docs
              </Link>
              <a
                href="#architecture"
                className="px-6 py-3 rounded-2xl border border-border hover:bg-muted transition"
              >
                View architecture
              </a>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="imageContainer"
          >
            <img
              src="/svgs/lfusys-arch.svg"
              alt="LFU Sys architecture overview"
              className="w-full h-auto rounded-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Core principles */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <Feature
            icon={<Upload />}
            title="Parallel uploads"
            description="Large files are split into chunks and uploaded concurrently for maximum throughput."
          />
          <Feature
            icon={<Hammer />}
            title="Smart Assembly"
            description="After upload completes, file chunks are automatically assembled using either multipart upload or streaming, based on file size."
          />
          <Feature
            icon={<Layers />}
            title="Session-driven"
            description="Upload sessions are tracked centrally, giving full visibility and control."
          />
          <Feature
            icon={<Cloud />}
            title="Cloud-native"
            description="Built on S3, DynamoDB, and SQS for durability and horizontal scalability."
          />
          <Feature
            icon={<ShieldCheck />}
            title="Secure by default"
            description="JWT-based auth with optional OAuth2 providers and strict boundaries."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold" id="architecture">
              How LFU Sys works
            </h2>
            <p className="opacity-80 leading-relaxed">
              The frontend initiates an upload session through the Gateway.
              Files are chunked client-side and uploaded in parallel to
              dedicated upload workers.
            </p>
            <p className="opacity-80 leading-relaxed">
              Each worker validates, persists chunks to object storage and sends
              upload events to a distributed queue.
            </p>
            <p className="opacity-80 leading-relaxed">
              Sessions service consumes upload events, updates upload status and
              assembles a file using multipart upload or streaming.
            </p>
            <p className="opacity-70 leading-relaxed">
              This separation of concerns allows LFU Sys to scale uploads,
              validation, and finalization independently.
            </p>
          </div>

          <div className="imageContainer">
            <img
              src="/svgs/service-dependency-diagram.svg"
              alt="Upload flow diagram"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold">Designed to be understood</h2>
        <p className="mt-4 opacity-80 max-w-2xl mx-auto">
          LFU Sys favors explicit flows, clear service boundaries, and
          predictable behavior over hidden magic. It’s a system you can reason
          about under pressure.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="https://github.com/Yulian302/lfusys"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-muted transition"
          >
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  )
}

type FeatureProps = {
  icon: React.ReactElement
  title: string
  description: string
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="opacity-75 leading-relaxed">{description}</p>
    </div>
  )
}
