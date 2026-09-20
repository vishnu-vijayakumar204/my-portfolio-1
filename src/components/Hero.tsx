export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Hi, I&apos;m
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">
        Vishnu Vijayakumar
      </h1>
      <p className="mt-6 max-w-xl text-lg text-zinc-600 sm:text-xl dark:text-zinc-400">
        I build clean, thoughtful software — from idea to shipped product.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="#projects"
          className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          View my work
        </a>
        <a
          href="#contact"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
