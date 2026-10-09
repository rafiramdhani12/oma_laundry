
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useAuth.tsx";

const Login = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const [form, setForm] = useState({
        name: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        loginMutation.mutate(form, {
            onSuccess: () => {
                navigate("/dashboard");
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={submitForm}
                className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-8 shadow"
            >
                <h1 className="text-2xl font-bold text-gray-900">
                    Oma Laundry
                </h1>

                <p className="text-sm text-gray-500">
                    Login to your account
                </p>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-blue-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-blue-500"
                />

                {loginMutation.isError && (
                    <p className="text-sm text-red-600">
                        Login gagal. Periksa nama dan password lu.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loginMutation.isPending
                        ? "Logging in..."
                        : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;