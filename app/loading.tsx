export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-5 h-5 border border-black dark:border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-[9px] tracking-[0.3em] text-black/30 dark:text-white/30">LOADING</p>
      </div>
    </div>
  )
}
