export const Notification = ({message, good}) => {

    if(message === undefined || message === null)  {
        return null
    }

    return (
        <div className={`notification ${good ? 'goodMessage' : 'badMessage'}`}>
            {message}
        </div>
    )
}