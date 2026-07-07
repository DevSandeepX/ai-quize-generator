export function hasPermission({ role }: {
    role: string | undefined
}) {
    return role?.toLocaleLowerCase() === "admin"
}