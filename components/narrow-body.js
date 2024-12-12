import { cn } from "@/lib/utils"

export const NarrowPageBody = ({className='p-4',children}) => (
    <div className={cn("max-w-5xl  mx-auto bg-background min-h-[66vh]", className)}>
        {children}
    </div>
)