import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get(
                    "/github/repositories",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setRepositories(response.data.repositories);

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch repositories"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, []);

    return (
        <div>
            <h1>CodeRipple AI Dashboard</h1>

            <h2>
                Welcome, {user?.name} 👋
            </h2>

            <p>
                Email: {user?.email}
            </p>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h2>Your GitHub Repositories</h2>

            {loading && (
                <p>Loading repositories...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {!loading &&
                !error &&
                repositories.length === 0 && (
                    <p>
                        No repositories found.
                    </p>
                )}

            <div>
                {repositories.map((repo) => (
                    <div key={repo.id}>
                        <h3>{repo.name}</h3>

                        <p>
                            {repo.full_name}
                        </p>

                        <p>
                            {repo.private
                                ? "Private"
                                : "Public"}
                        </p>

                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View on GitHub
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;