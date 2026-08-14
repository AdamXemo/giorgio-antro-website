interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] tracking-[0.2em] uppercase text-black/40">
        {label}
      </span>
      {children}
      {error && (
        <span className="text-[11px] text-red-500 tracking-wide">
          {error}
        </span>
      )}
    </div>
  )
}
