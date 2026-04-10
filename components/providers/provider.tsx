"use client"

import ReactQueryProvider from "./tanstack-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>

    )
}
