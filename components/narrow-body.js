import { cn } from "./cn"

export const NarrowPageBody = ({className,children}) => (
    <div className={cn("max-w-5xl  mx-auto p-4 bg-background min-h-[66vh]", className)}>
        {children}
    </div>
)