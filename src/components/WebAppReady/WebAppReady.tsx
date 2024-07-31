"use client";

import WebApp from "@twa-dev/sdk";

import React, { useEffect } from "react";
import { useUserStore } from "@/store";

export interface IWebAppReadyProps {}

/**
 * Web App Ready handler
 */
function WebAppReady(props: IWebAppReadyProps) {
  const setUserTmaInfo = useUserStore((state) => state.setUserTmaInfo);
  const isTmaInfoLoading = useUserStore((state) => state.isTmaInfoLoading);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof self !== "undefined" &&
      isTmaInfoLoading &&
      WebApp.initDataUnsafe?.chat?.id
    ) {
      setUserTmaInfo(WebApp.initDataUnsafe);
    }
  }, [isTmaInfoLoading, setUserTmaInfo]);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof self !== "undefined") {
      // if (process.env.NODE_ENV === "development") {
      //   import("eruda").then((eruda) => {
      //     eruda.default.init();
      //   });
      // }
      WebApp.ready();
      WebApp.expand();
    }
  }, []);

  return <div> </div>;
}

export default WebAppReady;
