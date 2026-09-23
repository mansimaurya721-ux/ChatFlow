import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Save JWT token in browser
            localStorage.setItem(
                "token",
                data.token
            );

            console.log(
                "Login successful:",
                data
            );

            alert("Login successful!");

            // Reload App so it can detect the logged-in user
            window.location.reload();

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>ChatFlow Login</h1>

            <form onSubmit={handleLogin}>

                {/* Email */}
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Error */}
                {error && (
                    <p>{error}</p>
                )}

                {/* Login button */}
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

            </form>
        </div>
    );
}

export default Login;