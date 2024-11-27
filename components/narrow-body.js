import { cn } from "./cn"

export const NarrowPageBody = ({className,children}) => (
    <div className={cn("max-w-5xl  mx-auto p-4 border-r border-l border-secondary min-h-[66vh]", className)}>
        {children}
    </div>
)