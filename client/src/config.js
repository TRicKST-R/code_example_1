export default {
  apiServerAddress: __DEV__ ? 'http://localhost:8080' : '***',
  STACKDRIVER_API_KEY: '***',
  projectId: '***',
  TRACKING_ID: '***',
  timeBeforeRequest: 500,
  longerTimeBeforeRequest: 1000,
  roles: {
    brewery: 'BREWERY',
    wholesaler: 'WHOLESALER'
  },
  statuses: {
    waiting: 'waiting for accept',
    newStatus: 'new',
    accepted: 'accepted',
    shipped: 'shipped',
    confirmed: 'confirmed'
  }
}
