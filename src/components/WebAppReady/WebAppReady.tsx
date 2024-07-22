"use client";

import WebApp from "@twa-dev/sdk";

import React, { useEffect } from "react";

export interface IWebAppReadyProps {}

/**
 * Web App Ready handler
 */
function WebAppReady(props: IWebAppReadyProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof self !== "undefined") {
      import("eruda").then((eruda) => {
        WebApp.ready();
        WebApp.expand();
        eruda.default.init();
      });
    }
  }, []);
  return <div> </div>;
}

export default WebAppReady;
