export const Notification = ({message, good}) => {
    console.log(message);
    console.log(good);

    if(message === undefined || message === null)  {
        return null
    }

    return (
        <div className={`notification ${good ? 'goodMessage' : 'badMessage'}`}>
            {message}
        </div>
    )
}