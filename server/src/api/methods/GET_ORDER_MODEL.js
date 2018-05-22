import log from '../../utils/log'

export default async ({ payload = {}, socket, emitAction }) => {
  try {
    const columns = [
      {
        key: 'breweryId',
        name: 'breweryId'
      },
      {
        key: 'status',
        name: 'status',
        options: [
          {
            id: 'accepted',
            title: 'accepted'
          },
          {
            id: 'new',
            title: 'new'
          },
          {
            id: 'shipped',
            title: 'shipped'
          },
          {
            id: 'confirmed',
            title: 'confirmed'
          },
          {
            id: 'waiting for accept',
            title: 'waiting for accept'
          }
        ]
      },
      {
        key: 'order_date',
        name: 'order_date'
      },
      {
        key: 'accept_date',
        name: 'accept_date'
      },
      {
        key: 'confirm_date',
        name: 'confirm_date'
      },
      {
        key: 'ship_date',
        name: 'ship_date'
      }
    ]

    emitAction('SET_ORDERS_COLUMNS', columns)
  } catch (error) {
    log.err(error)
  }
}
