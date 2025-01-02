import { cn } from "@/lib/utils"

function code(args) {
	const {className, children, ...props} = args
	const match = /language-(\w+)/.exec(className || '')
	
	function getContent(){
		if (match) return children
		if (typeof children !== 'string') return children

		const re = /^`?(.*?)`*$/.exec(children)
		if (!re) return children

		return re[1]
	}

	return match? (
		<code className={cn("text-xs",className)} {...props}>{children}</code>
	)
	: (
		<span 
			className={cn('text-sm font-mono inline-block bg-secondary p-1 rounded',className)} 
			{...props}
		>
			{getContent()}
		</span>
	)
}

export const useMDXComponents = components=>({
	...components,
	code
})

