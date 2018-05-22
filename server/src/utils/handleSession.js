import log from '../utils/log'

export default async ({
  Company,
  user: { id, user_name, email, companyId, permissions },
  sessionData,
  emitAction
}) => {
  try {
    const company = await Company.findOne({
      where: {
        id: companyId
      }
    })

    sessionData.set('companyId', company.id)
    sessionData.set('_id', id.toString())
    sessionData.set('name', user_name)
    sessionData.set('email', email)
    sessionData.set('role', company.role)
    sessionData.set('name', company.company_name)

    emitAction('SESSION_STATE', {
      isLoggedIn: true,
      email,
      name: user_name,
      company_id: company.id,
      company_name: company.name,
      role: company.role,
      permissions: permissions
    })
  } catch (err) {
    log.err(err)
  }
}
