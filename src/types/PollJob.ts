export type PollParams = {
  intervalMinutes: number;
  serial: {
    method: "poll";
    name: string;
    startUrl: string;
    paging: {
      method: "nextCursor";
      nextUrlField: string;
      dataField: string;
    };
    sendBearerToken: boolean;
  }[];
};
