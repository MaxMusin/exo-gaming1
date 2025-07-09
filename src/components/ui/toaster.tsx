import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-black/90 text-white border-white/30 shadow-2xl backdrop-blur-sm",
          description: "text-white/80",
          actionButton:
            "bg-blue-600 text-white hover:bg-blue-700",
          cancelButton:
            "bg-gray-600 text-white hover:bg-gray-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
