interface PageHeaderProps {
    title: string,
    className?: string,
    children?: React.ReactNode
}

export function PageHeader({
    title,
    children,
    className
}: PageHeaderProps) {
    return (
        <div className={`flex justify-between items-start ${className}`}>
            <h2 className='text-2xl font-semibold'>{title}</h2>
            {children && (
                <div>{children}</div>
            )}
        </div>
    )
}