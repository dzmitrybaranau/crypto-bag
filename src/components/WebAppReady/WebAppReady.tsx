"use client";

import WebApp from "@twa-dev/sdk";

import React, { useEffect } from "react";
import eruda from "eruda";

export interface IWebAppReadyProps {}

/**
 * Web App Ready handler
 */
function WebAppReady(props: IWebAppReadyProps) {
  useEffect(() => {
    if (typeof window !== undefined) {
      WebApp.ready();
      WebApp.expand();
      eruda.init();
    }
  }, []);
  return <div> </div>;
}

export default WebAppReady;
