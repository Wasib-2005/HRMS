"use client";

import Image from 'next/image';
import Link from 'next/link';



const Reset = () => {


    return (
        <main className="flex  h-[calc(100vh-4rem)] px-5 items-center justify-center   animate-fade-up animate-duration-[600ms] animate-ease-in">
            <section className="grid w-full max-w-xl overflow-hidden  ">


                <div className="flex items-center justify-center ">
                    <form className="w-full max-w-sm space-y-12">
                        <div className="space-y-1 text-center">
                            <Image
                                src="/site_logo.svg"
                                width={160}
                                height={160}
                                alt="EuITSols logo"
                                className=" mx-auto h-15 w-auto"
                            />
                            <div className="pt-7">

                                <p className="text-2xl font-semibold ">
                                    Reset Password
                                </p>

                                <p className="text-sm  ">
                                   Reset password quickly and securely to regain access.
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

                            
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-[#0c8ce8] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                            >
                                Get Code
                            </button>

                            <p className="text-[16px] text-center text-slate-500 ">
                                Try Another way? <Link href="/login" className="text-[#0c8ce8]">Login</Link>
                            </p>

                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Reset;
