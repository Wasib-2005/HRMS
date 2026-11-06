"use client";

import Image from "next/image";
import { useState } from "react";
import { FaCheck, FaCircle, FaEye, FaEyeLowVision } from "react-icons/fa6";

const ResetPassword = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "At least one uppercase character (A–Z)", met: /[A-Z]/.test(password) },
        { label: "At least one number (0–9)", met: /[0-9]/.test(password) },
        { label: "At least one special character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
    ];
    const passwordIsValid = passwordRequirements.every(({ met }) => met);
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const showPasswordMismatch = confirmPassword.length > 0 && !passwordsMatch;

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10 animate-fade-up animate-duration-[600ms] animate-ease-in">
            <section className="w-full max-w-[460px]">
                <header className="mb-10 text-center">


                    <Image
                        src="/site_logo.svg"
                        width={160}
                        height={160}
                        alt="EuITSols logo"
                        className=" mx-auto h-15 w-auto"
                    />
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 pt-5">
                        Reset Password
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Set a strong password to secure access.
                    </p>
                </header>

                <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                    <div className="space-y-2">
                        <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
                            New Password<span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="new-password"
                                name="new-password"
                                type={passwordVisible ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                minLength={8}
                                placeholder="Enter new password"
                                aria-describedby="password-requirements"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                pattern="(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
                                className="block w-full rounded-xl border border-slate-300 bg-[#f1f5f9] px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible((visible) => !visible)}
                                aria-label={passwordVisible ? "Hide new password" : "Show new password"}
                                aria-pressed={passwordVisible}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-700"
                            >
                                {passwordVisible ? <FaEyeLowVision size={18} aria-hidden="true" /> : <FaEye size={18} aria-hidden="true" />}
                            </button>
                        </div>
                        <ul id="password-requirements" className="space-y-1.5 pl-1 text-sm">
                            {passwordRequirements.map(({ label, met }) => (
                                <li key={label} className={`flex items-center gap-2 ${met ? "text-emerald-700" : "text-slate-500"}`}>
                                    {met ? <FaCheck aria-hidden="true" className="shrink-0" /> : <FaCircle aria-hidden="true" className="shrink-0 text-[6px]" />}
                                    <span>{label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
                            Confirm Password<span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type={confirmPasswordVisible ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                aria-invalid={showPasswordMismatch}
                                aria-describedby={showPasswordMismatch ? "password-mismatch" : undefined}
                                className="block w-full rounded-xl border border-slate-300 bg-[#f1f5f9] px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                            />
                            <button
                                type="button"
                                onClick={() => setConfirmPasswordVisible((visible) => !visible)}
                                aria-label={confirmPasswordVisible ? "Hide confirmed password" : "Show confirmed password"}
                                aria-pressed={confirmPasswordVisible}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-700"
                            >
                                {confirmPasswordVisible ? <FaEyeLowVision size={18} aria-hidden="true" /> : <FaEye size={18} aria-hidden="true" />}
                            </button>
                        </div>
                        {showPasswordMismatch && (
                            <p id="password-mismatch" role="alert" className="text-sm text-red-600">
                                Passwords do not match.
                            </p>
                        )}
                        {passwordsMatch && (
                            <p className="text-sm text-emerald-700" role="status">
                                Passwords match.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!passwordIsValid || !passwordsMatch}
                        className="flex w-full justify-center rounded-lg bg-[#0c8ce8] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save Changes
                    </button>
                </form>
            </section>
        </main>
    );
};

export default ResetPassword;