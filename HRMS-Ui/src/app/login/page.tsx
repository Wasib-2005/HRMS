"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";
import { FaEye, FaEyeLowVision } from "react-icons/fa6";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <main className="flex  h-[calc(100vh-4rem)] px-5 items-center justify-center   animate-fade-up animate-duration-[600ms] animate-ease-in">
            <section className="grid w-full max-w-xl overflow-hidden  ">


                <div className="flex items-center justify-center ">
                    <form className="w-full max-w-sm space-y-12">
                        <div className="space-y-1 text-center">
                            <Image
                                src="site_logo.svg"
                                width={160}
                                height={160}
                                alt="EuITSols logo"
                                className=" mx-auto h-15 w-auto"
                            />
                            <div className="">

                                <p className="text-lg font-semibold ">
                                    Enter your details to sign in.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="you@example.com"
                                    className="block w-full rounded-xl bg-[#f1f5f9] border border-slate-300 px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="relative">

                                    <input
                                        id="password"
                                        name="password"
                                        type={passwordVisible ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        placeholder="Enter your password"
                                        className="block w-full rounded-xl border bg-[#f1f5f9] border-slate-300 px-3.5 py-3 pr-11 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible((visible) => !visible)}
                                        aria-label={passwordVisible ? "Hide password" : "Show password"}
                                        aria-pressed={passwordVisible}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-700"
                                    >
                                        {passwordVisible ? <FaEyeLowVision size={20} aria-hidden="true" /> : <FaEye size={20} aria-hidden="true" />}
                                    </button>
                                </div>
                                
                                <p className="text-right pb-4">

                                    <Link href="/forgot-password" className=" text-sm font-semibold text-sky-700 transition hover:text-sky-800 ">
                                        Forgot your password?
                                    </Link>
                                </p>

                            </div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-sky-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Login;
