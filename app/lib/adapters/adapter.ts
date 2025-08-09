export interface DateRange {
  from: Date;
  to: Date;
}

export class Adapter {
  public dateRange: DateRange;

  constructor(dateRange: DateRange) {
    this.dateRange = dateRange;
  }
}
