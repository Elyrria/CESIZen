import React from 'react'

interface BentoGridProps {
    children: React.ReactNode
    className?: string
}

interface BentoItemProps {
    children: React.ReactNode
    className?: string
    title?: string
    description?: string
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = "" }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto p-4 ${className}`}>
            {children}
        </div>
    )
}

export const BentoItem: React.FC<BentoItemProps> = ({
    title,
    description,
    className = "",
    children
}) => {
    return (
        <div className={`group relative overflow-hidden rounded-xl border border-fr-grey-light bg-white p-4 hover:shadow-fr-md transition-shadow ${className}`}>
            {/* Header avec titre et description */}
            {(title || description) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-lg font-bold text-fr-blue mb-1">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-sm text-fr-grey-dark">
                            {description}
                        </p>
                    )}
                </div>
            )}
            
            {/* Contenu principal */}
            <div className="relative z-10">
                {children}
            </div>
            
            {/* Effet de survol */}
            <div className="absolute inset-0 bg-gradient-to-b from-fr-blue/0 to-fr-blue/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    )
}

// Composants spécialisés pour différentes tailles
export const BentoItemFull: React.FC<BentoItemProps> = (props) => (
    <BentoItem {...props} className="md:col-span-2 lg:col-span-3" />
)

export const BentoItemWide: React.FC<BentoItemProps> = (props) => (
    <BentoItem {...props} className="md:col-span-2" />
)

export const BentoItemTall: React.FC<BentoItemProps> = (props) => (
    <BentoItem {...props} className="row-span-2" />
)
