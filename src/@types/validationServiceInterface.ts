interface ILog {
  hour?: number;
  day?: number;
  month?: number;
  count: number;
  avgHour: number;
}

interface IData {
  entryTimes: ILog[];
  exitTimes: ILog[];
}

interface IFormattedData {
  entryLogs: any[];
  exitLogs: any[];
}

export { IData, IFormattedData, ILog };
