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
      : 'w-14 text-base'

  const btnBase =
    'flex items-center justify-center text-black/55 ' +
    'hover:text-black hover:bg-black/[0.03] ' +
    'transition-colors disabled:opacity-30'

  return (
    <div className="inline-flex items-stretch border border-black/15 rounded-[2px]">
      <button
        onClick={onDecrement}
        className={`${btnClass} ${btnBase}`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className={`${spanClass} flex items-center justify-center border-x border-black/15 tabular-nums select-none`}
      >
        {value}
      </span>
      <button
        onClick={onIncrement}
        className={`${btnClass} ${btnBase}`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
