"use client";

import { useQuery } from "@tanstack/react-query";
import {
  GetRunOptions,
  GetRunSchema,
  urlWithSearchParams,
} from "@trigger.dev/internal";
import { zodfetch } from "./fetch";
import { useTriggerProvider } from "./TriggerProvider";

const resolvedStatuses = [
  "SUCCESS",
  "FAILURE",
  "CANCELED",
  "TIMED_OUT",
  "ABORTED",
];

const defaultRefreshInterval = 5000;

type Options = GetRunOptions & {
  refreshInterval?: number;
};

export function useRunDetails(runId: string, options?: Options) {
  const { apiUrl, publicApiKey } = useTriggerProvider();

  const { refreshInterval, ...otherOptions } = options || {};

  const url = urlWithSearchParams(
    `${apiUrl}/api/v1/runs/${runId}`,
    otherOptions
  );
  return useQuery(
    [`run-${runId}`],
    async () => {
      return await zodfetch(GetRunSchema, url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${publicApiKey}`,
        },
      });
    },
    {
      refetchInterval: (data, query) => {
        // if (data?.status && resolvedStatuses.includes(data.status)) {
        //   return false;
        // }
        return refreshInterval ?? defaultRefreshInterval;
      },
    }
  );
}
