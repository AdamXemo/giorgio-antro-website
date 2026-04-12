interface QuantitySelectorProps {
  value: number
  onDecrement: () => void
  onIncrement: () => void
  /** 'sm' for cart, 'md' for product page. Defaults to 'md'. */
  size?: 'sm' | 'md'
}

export default function QuantitySelector({
  value,
  onDecrement,
  onIncrement,
  size = 'md',
}: QuantitySelectorProps) {
  const btnClass =
    size === 'sm'
      ? 'w-8 h-8 text-sm'
      : 'w-11 h-11 text-base'
  const spanClass =
    size === 'sm'
      ? 'w-10 text-sm'
      : 'w-14 text-sm'

  return (
    <div className="flex items-center">
      <button
        onClick={onDecrement}
        className={`${btnClass} border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={`${spanClass} text-center tabular-nums`}>{value}</span>
      <button
        onClick={onIncrement}
        className={`${btnClass} border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
