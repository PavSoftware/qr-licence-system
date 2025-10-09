export const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super-admin') {
        return res.status(403).send({ message: 'Acesso restrito ao Super Admin.' })
    }
    req.admin = req.user.id
    next()
}