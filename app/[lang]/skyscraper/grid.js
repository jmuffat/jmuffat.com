export function SkyscraperGrid({data}) {
    return (
        <pre className="text-xs">{JSON.stringify(data,null,3)}</pre>
    )
}