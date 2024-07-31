"use client";

import WebApp from "@twa-dev/sdk";

import React, { useEffect, useLayoutEffect } from "react";
import styles from "./WebAppReady.module.scss";
import { useUserStore } from "@/store";

export interface IWebAppReadyProps {}

/**
 * Web App Ready handler
 */
function WebAppReady(props: IWebAppReadyProps) {
  const setUserTmaInfo = useUserStore((state) => state.setUserTmaInfo);
  const isTmaInfoLoading = useUserStore((state) => state.isTmaInfoLoading);
  const isUserLoading = useUserStore((state) => state.isUserLoading);
  const userTmaInfo = useUserStore((state) => state.userTmaInfo);
  const fetchUserAccount = useUserStore((state) => state.fetchUserAccount);

  useEffect(() => {
    console.log({ isTmaInfoLoading, isUserLoading, id: userTmaInfo?.chat?.id });
    if (!isTmaInfoLoading && isUserLoading && userTmaInfo?.chat?.id) {
      fetchUserAccount(userTmaInfo.chat.id.toString());
    }
  }, [isTmaInfoLoading, isUserLoading, fetchUserAccount, userTmaInfo]);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof self !== "undefined") {
      WebApp.ready();
      WebApp.expand();
      setUserTmaInfo(WebApp?.initDataUnsafe);

      import("eruda").then((eruda) => {
        eruda.default.init();
      });
    }
  }, [setUserTmaInfo, WebApp?.initDataUnsafe]);

  if (isUserLoading) {
    return (
      <div className={styles.loader}>
        Loading{" "}
        {JSON.stringify({
          isUserLoading,
          isTmaInfoLoading,
          id: userTmaInfo?.chat?.id,
        })}
      </div>
    );
  }

  return <></>;
}

export default WebAppReady;
