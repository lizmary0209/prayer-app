import "./Profile.css";

export default function Profile({ currentUser }) {
    if (!currentUser) {
        return (
            <main className="profile">
                <h1 className="profile__title">Profile</h1>
                <p>Please sign in to view your profile.</p>
            </main>
        );
    }

    return (
        <main className="profile">
            <h1 className="profile__title">Profile</h1>

            <div className="profile__card">
                <img
                className="profile__avatar"
                src={currentUser.profilePic || "https://ui-avatars.com/api/?name=User"}
                alt={`${currentUser.displayName} avatar`}
                referrerPolicy="no-referrer"
                />
                <div>
                    <p className="profile__name">{currentUser.displayName}</p>
                    <p className="profile__email">{currentUser.email}</p>
                </div>
            </div>

            <p className="profile__note">
                Next we'll add "Edit Profile" (name + avatar) and "My Prayers".
            </p>
        </main>
    );
}