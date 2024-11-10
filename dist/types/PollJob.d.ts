export type PollParams = {
    method: "poll";
    intervalMinutes: number;
    startUrl: string;
    paging: {
        method: "nextCursor";
        nextUrlField: string;
        dataField: string;
    };
    sendBearerToken: boolean;
};
