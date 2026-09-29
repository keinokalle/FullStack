import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert severity={notification.type} variant="filled">
      {notification.message}
    </Alert>
  )
}

export default Notification
