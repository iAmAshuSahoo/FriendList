export default function ShowFriend ({friend, index, handleFavorite, removeFriend}) {
    return (
        <div className="friend general" key={index}>
            <div>{friend.name}</div>
            <div>
                {friend.isFavorite ?
                    <img 
                        src={require('../../Assets/golden-star.png').default}
                        onClick={() => handleFavorite(index, "REMOVE_FAVORITE")}
                        className="favorite"
                        alt="favorite-friend"
                    /> :
                    <img 
                        src={require('../../Assets/star.png').default}
                        onClick={() => handleFavorite(index, "ADD_FAVORITE")}
                        className="favorite"
                        alt="not a favorite friend"
                    />
                }
                <img 
                    src={require('../../Assets/dustbin.png').default}
                    onClick={() => removeFriend(index)}
                    className="favorite dustbin"
                    alt="not a favorite friend"
                />
            </div>
        </div>
    );
}