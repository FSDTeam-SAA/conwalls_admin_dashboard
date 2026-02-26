"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
// home_bg is loaded from public/images/ via Next.js public path
import Image from "next/image";

const HomeContainer = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-full -mt-[108px] relative">
      <Image
        src="/images/home_bg.png"
        alt="auth logo"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default HomeContainer;