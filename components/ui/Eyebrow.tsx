interface EyebrowProps {
  label: string
  className?: string
}

export default function Eyebrow({ label, className = '' }: EyebrowProps) {
  return (
    <p className={`text-[10px] tracking-[0.3em] text-black/35 ${className}`}>
      {label}
    </p>
  )
}
