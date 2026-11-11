"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';



const Verification = () => {
    const [counter, setCounter] = useState(120);

    useEffect(() => {
        if (counter === 0) return;

        const timer = window.setTimeout(() => {
            setCounter((seconds) => seconds - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [counter]);

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
                                    Verification code
                                </p>

                                <p className="text-sm  ">
                                    Enter the verification code to confirm your identity
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">

                                <input
                                    id="number"
                                    name="number"
                                    type="text"
                                    autoComplete="number"
                                    required
                                    placeholder="Enter your code"
                                    className="block w-full rounded-xl bg-[#f1f5f9] border border-slate-300 px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 text-center"
                                />
                            </div>

                            <p className="text-sm text-slate-500 mt-[-15px] ">
                                {counter > 0 ? (
                                    <>Your code expires in <span className="font-medium tabular-nums" role="timer">{counter}s</span>.</>
                                ) : (
                                    <span role="status">Your code has expired.</span>
                                )}
                            </p>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-[#0c8ce8] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                            >
                                Verify Code
                            </button>

                            <p className="text-[16px] text-center text-slate-500 ">
                                Didn’t receive the code?{" "} 
                                 <span onClick={() => setCounter(120)} className="text-[#0c8ce8] hover:text-[#0a6db3] cursor-pointer hover:underline hover:underline-offset-2">Resend</span>
                            </p>

                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Verification;
