"use client";

import { Cookie, IBM_Plex_Mono, Manufacturing_Consent } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Link from "next/link";
import { XMasonry, XBlock } from "react-xmasonry"; // Imports precompiled bundle
import { Spinner } from "@/components/ui/spinner"
import Logo from "../public/nlogo.svg"

const IBMMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const CookieFont = Cookie({
  variable: "--font-cookie",
  subsets: ["latin"],
  weight: ["400"],
});

const slides = [
  "https://picsum.photos/id/1018/1000/600/",
  "https://picsum.photos/id/1015/1000/600/",
  "https://picsum.photos/id/1024/1000/600/",
  "https://picsum.photos/id/1019/1000/600/",
  "https://picsum.photos/id/1025/1000/600/",

];

interface LightboxImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export default function Home() {
  const [dataPort, setDataPort] = useState<any[]>([]);
  const [portImages, setPortImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [imgHeight, setImgHeight] = useState<number | null>(null);
  const [imgWidth, setImgWidth] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<LightboxImage | null>(null);

  const strapiApiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'; // Assuming you have this in your .env as well

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${strapiApiUrl}/api/portfolio-images?populate=*`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${strapiApiToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched data:", result);
        // console.log(strapiApiUrl + result.data[0].image[1].url);

        setDataPort(result.data); // usually result.data in Strapi
        setPortImages(dataPort[0]?.image);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  // console.log(dataPort[0]?.image[0]);

  const [emblaRef] = useEmblaCarousel(
    {
      axis: "y",
      loop: false,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    // [WheelGesturesPlugin()]
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  function isVideo(url: string): boolean {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  }

  function isVideoFile(data: any): boolean {
    return data?.mime?.startsWith("video/");
  }

  return (
    loading ? (
      <div className="min-h-screen flex items-center justify-center bg-zinc-300">
        <p className="text-black"><Spinner className="h-7 w-7"/></p>
      </div>
    ) : error ? (
      <div className="min-h-screen flex items-center justify-center bg-zinc-300">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    ) : (
    <div className="min-h-screen bg-zinc-300 font-sans text-black overflow-hidden flex flex-col mx-auto">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center fixed w-full top-0 bg-zinc-300 z-10">
        <div className="flex items-center gap-2">
          {/* <div className={`${IBMMono.className} text-lg font-bold`}> */}
            <Image alt="" src={Logo} className="h-4 w-fit"/>
          {/* </div> */}
          <div>

          </div>
        </div>
        <div className="flex gap-2 items-center">

          <div className="text-xs ">
            <p>{currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="text-xs bg-base w-fit text-center py-0.5 px-3 rounded-full">
            <p className="">{currentTime.getFullYear()}</p>
          </div>
        </div>
      </div>

      <div className="pt-[52px]">
        <div className="">
          <XMasonry>
            {dataPort[0]?.image.map((data: any) => {
              const fileUrl = `${data.url}`;
              const isVid = isVideoFile(data) || isVideo(data.url);

              return (
                <XBlock key={data.id}>
                  <div
                    className="hover:opacity-70 transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={() => setSelectedImage(data)}
                  >
                    {isVid ? (
                      <video
                        src={fileUrl}
                        className="select-none w-full h-auto"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img
                        src={fileUrl}
                        alt={data.alternativeText || ""}
                        className="select-none w-full h-auto object-cover"
                      />
                    )}
                  </div>
                </XBlock>
              );
            })}
          </XMasonry>
        </div>
      </div>

      {selectedImage && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/90 backdrop-blur-sm
            transition-opacity duration-300
          "
          onClick={() => setSelectedImage(null)}
        >
          <div className="w-screen h-screen flex justify-center items-center p-4">
            {isVideoFile(selectedImage) || isVideo(selectedImage?.url) ? (
              <video
                src={`${selectedImage?.url}`}
                className="w-full object-contain select-none p-8"
                autoPlay
                controls
                playsInline
              />
            ) : (
              <img
                src={`${selectedImage?.url}`}
                alt={selectedImage.alternativeText || "Full image"}
                width={100}
                height={100}
                className="h-full w-full object-contain select-none p-8"
              />
            )}
          </div>
        </div>
      )}

      {/* <div className="pt-[52px]">
        <div className="">
          <XMasonry>
            {dataPort[0]?.image.map((data: any) => {
              const fileUrl = `${data.url}`;
              const isVid = isVideoFile(data) || isVideo(data.url);
              return (
                <XBlock key={data.id}>
                  <div
                    className="hover:opacity-70 transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={() => setSelectedImage(data)}
                  >
                    {isVid ? (
                      <video
                        src={`http://localhost:1337${fileUrl}`}
                        className="select-none w-full h-auto"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img
                        src={`http://localhost:1337${fileUrl}`}
                        alt={data.alternativeText || ""}
                        className="select-none w-full h-auto object-cover"
                      />
                    )}
                  </div>
                </XBlock>
              );
            })}
          </XMasonry>
        </div>
      </div>
      
      {selectedImage && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/90 backdrop-blur-sm
            transition-opacity duration-300
          "
          onClick={() => setSelectedImage(null)}
        >
          <div className="w-screen h-screen p-4">
            {isVideoFile(selectedImage) || isVideo(selectedImage?.url) ? (
              <video
                src={`http://localhost:1337${selectedImage?.url}`}
                className="h-full w-full object-contain select-none p-8"
                autoPlay
                controls
                playsInline
              />
            ) : (
              <img
                src={`http://localhost:1337${selectedImage?.url}`}
                alt={selectedImage.alternativeText || "Full image"}
                width={100}
                height={100}
                className="h-full w-full object-contain select-none p-8"
              />
            )}
          </div>
        </div>
      )} */}

    </div>
  ));
}
