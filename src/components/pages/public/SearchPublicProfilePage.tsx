import React, { useEffect, useState } from "react";
import '../../assets/css/style.css';
import nullPhoto from '../../assets/images/avatar/NullUserPhoto.png';
import Menubar from "../shared/Menubar";
import { searchUsername } from "../../../apis/ProfileApi";

interface Profile {
    username: string;
    fullName?: string | null; 
    profilePhoto: string | null;
}

const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;

const SearchPublicProfile: React.FC = () => {
    const [query, setQuery] = useState<string>(() => {
        return localStorage.getItem("searchQuery") ?? "";
    });
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const apiUrl: string = process.env.REACT_APP_BACKEND_HOST!;
    const loggedUser = localStorage.getItem('loggedUser');

    useEffect(() => {
        if (query.trim() === "") {
            setProfiles([]);
            return;
        }

        const findProfiles = async () => {
            setLoading(true);
            try {
                const response = await searchUsername(query);
                setProfiles(response);
            } catch (error) {
                console.error("Error fetching profiles:", error);
                setProfiles([]);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => findProfiles(), 300);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    useEffect(() => {
        localStorage.setItem("searchQuery", query);
    }, [query]);

    return (
        <div className="page-wraper header-fixed">
            <header className="header">
                <div className="container">
                    <form className="my-3">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <span className="input-group-text">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
                                        fill="var(--primary)"
                                    />
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
            </header>
            <div className="page-content mt-3">
                <div className="content-inner pt-0">
                    <div className="container p-b50">
                        <div className="post-card">
                            {loading && <p>Loading...</p>}
                            {!loading && profiles.length === 0 && query && (
                                <p>No profiles found.</p>
                            )}
                            {profiles.map((profile, index) => (
                                <a
                                    href={`/profile/${profile.username}`}
                                    key={index}
                                    className="profile-card d-flex align-items-center mb-2 p-2 rounded shadow-sm text-decoration-none"
                                    style={{
                                        color: "inherit",
                                        padding: "10px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <div className="media media-40 me-2">
                                        <img
                                            className="rounded-circle"
                                            src={profile.profilePhoto ? `${`${apiUrl}/users/` + profile.profilePhoto}` : nullPhoto}
                                            alt="profile"
                                            style={{ width: "40px", height: "40px" }}
                                        />
                                    </div>
                                    <div className="profile-details">
                                        <h6
                                            className="username mb-1"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "14px",
                                                marginBottom: profile.fullName ? "3px" : "0",
                                            }}
                                        >
                                            {profile.username}
                                        </h6>
                                        {profile.fullName && (
                                            <p
                                                className="fullname text-muted mb-0"
                                                style={{ fontSize: "12px" }}
                                            >
                                                {profile.fullName}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <Menubar />
            </div>
        </div>
    );
};

export default SearchPublicProfile;
