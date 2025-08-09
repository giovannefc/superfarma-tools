export function fetcherIsDone(fetcher: any) {
  return fetcher.state === "idle" && fetcher.data != null;
}
