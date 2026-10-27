interface CartBadgeProps {
  count: number
}

export default function CartBadge({ count }: CartBadgeProps) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1.5 -right-2 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center leading-none">
      {count}
    </span>
  )
}
