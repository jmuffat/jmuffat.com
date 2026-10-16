import { Suspense } from 'react'
import { SkyscraperClientPage } from "./client-page"

export default function SkyscraperPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SkyscraperClientPage />
        </Suspense>
    )
}


